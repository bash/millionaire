DROP SCHEMA IF EXISTS mill CASCADE;
CREATE SCHEMA mill;

CREATE SEQUENCE IF NOT EXISTS mill.table_id_seq;

CREATE OR REPLACE FUNCTION mill.next_id(OUT result BIGINT) AS $$
DECLARE
  our_epoch BIGINT := 1487721600000;
  seq_id BIGINT;
  now_millis BIGINT;
  shard_id INT := 1;
BEGIN
  SELECT MOD(1024 + MOD(nextval('mill.table_id_seq'), 1024), 1024)
  INTO seq_id;

  SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000)
  INTO now_millis;
  result := (now_millis - our_epoch) << 23;
  result := result | (shard_id << 10);
  result := result | (seq_id);
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION mill.utc_now() RETURNS TIMESTAMP AS $$
BEGIN
  RETURN now() AT TIME ZONE 'UTC';
END;
$$ LANGUAGE PLPGSQL;

CREATE TABLE mill.admin (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX admin_lower_username ON mill.admin (lower(username));

CREATE TABLE mill.category (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mill.question (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  title VARCHAR(255) NOT NULL,
  category_id BIGINT NOT NULL REFERENCES mill.category (id)
);

CREATE INDEX question_category_id ON mill.question (category_id);

-- Todo: write trigger to ensure there's only one correct answer per question
CREATE TABLE mill.answer (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  title VARCHAR(255) NOT NULL,
  is_correct BOOL NOT NULL,
  question_id BIGINT NOT NULL REFERENCES mill.question (id) ON DELETE CASCADE
);

-- Todo: do we need something else associated with the player?
-- Todo: do we need the name?
CREATE TABLE mill.player (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT mill.utc_now()
);

-- Todo: review naming of 'started_at' and 'ended_at'
-- Todo: review 'has_used_joker'
-- Todo: does setting 'started_at' make sence when creating the game or should that be done later on?
CREATE TABLE mill.game (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  has_used_joker BOOLEAN NOT NULL DEFAULT FALSE,
  player_id BIGINT NOT NULL REFERENCES mill.player (id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT mill.utc_now(),
  ended_at TIMESTAMP NULL
);

CREATE TABLE mill.game_category (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  game_id BIGINT NOT NULL REFERENCES mill.game (id),
  category_id BIGINT NOT NULL REFERENCES mill.category (id)
);

CREATE UNIQUE INDEX game_category_unique ON mill.game_category (game_id, category_id);

-- Todo: use trigger to enforce one answer per (question, game)
CREATE TABLE mill.game_answer (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  game_id BIGINT NOT NULL REFERENCES mill.game (id) ON DELETE CASCADE,
  answer_id BIGINT NOT NULL REFERENCES mill.answer (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX game_answer_unique ON mill.game_answer (game_id, answer_id);

CREATE OR REPLACE VIEW mill.game_answered_question AS
  SELECT
    question.*,
    answer.id AS answer_id,
    answer.is_correct,
    game_answer.game_id AS game_id
  FROM mill.question AS question
    JOIN mill.answer
      AS answer
      ON question.id = answer.question_id
    JOIN mill.game_answer
      AS game_answer
      ON answer.id = game_answer.answer_id;

-- Todo: optimize this (remove dependency on view game_answered_question)
CREATE OR REPLACE VIEW mill.game_question AS
  SELECT question.*, game.id AS game_id
  FROM mill.question AS question
    JOIN mill.game_category
      AS category
      ON question.category_id = category.category_id
    JOIN mill.game
      AS game
      ON category.game_id = game.id
    LEFT OUTER JOIN mill.game_answered_question
      AS answered
      ON question.id = answered.id AND answered.game_id = game.id
  WHERE answered.id IS NULL
  GROUP BY question.id, game.id;

-- Todo: this table introduces redundant
-- Todo: ... but is required for the admin to be able to delete high score entries
-- Todo: ... without deleting the user/game itself
-- Todo: review naming
-- Todo: should we still reference the game?

CREATE TABLE mill.score (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  score INT NOT NULL,
  game_id BIGINT NULL REFERENCES mill.game (id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX score_game_id ON mill.score (game_id);

CREATE OR REPLACE FUNCTION mill.calculate_score(_game_id BIGINT) RETURNS INT AS $$
  DECLARE
    score INT;
    has_lost BOOLEAN;
  BEGIN
    SELECT INTO score, has_lost
      (count(1) FILTER (WHERE is_correct = TRUE)) * 30,
      (count(1) FILTER (WHERE is_correct = FALSE)) > 0
    FROM mill.game_answered_question AS answered
    WHERE answered.game_id = _game_id;

    IF has_lost THEN
      RETURN 0;
    END IF;

    RETURN score;
  END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION mill.update_score(_game_id BIGINT) RETURNS VOID AS $$
DECLARE
  _score INT;
BEGIN
  SELECT mill.calculate_score(_game_id) INTO _score;

  INSERT INTO mill.score (score, game_id)
  VALUES (_score, _game_id)
  ON CONFLICT (game_id) DO UPDATE SET score = _score;
END;
$$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION mill.update_score_on_insert() RETURNS TRIGGER AS $$
BEGIN
  PERFORM mill.update_score(NEW.game_id);
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;


CREATE TRIGGER update_score AFTER INSERT ON mill.game_answer
  FOR EACH ROW EXECUTE PROCEDURE mill.update_score_on_insert();