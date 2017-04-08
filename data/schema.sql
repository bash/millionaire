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

CREATE TABLE mill.answer (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  title VARCHAR(255) NOT NULL,
  is_correct BOOL NOT NULL,
  question_id BIGINT NOT NULL REFERENCES mill.question (id) ON DELETE CASCADE
);

CREATE TABLE mill.player (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT mill.utc_now()
);

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

CREATE TABLE mill.game_answer (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  game_id BIGINT NOT NULL REFERENCES mill.game (id) ON DELETE CASCADE,
  answer_id BIGINT NOT NULL REFERENCES mill.answer (id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT mill.utc_now()
);

CREATE UNIQUE INDEX game_answer_unique ON mill.game_answer (game_id, answer_id);

CREATE OR REPLACE VIEW mill.game_question AS
  SELECT question.*, game.id AS game_id
  FROM mill.question AS question
    JOIN mill.game_category
      AS category
      ON question.category_id = category.category_id
    JOIN mill.game
      AS game
      ON category.game_id = game.id
  GROUP BY question.id, game.id;


CREATE OR REPLACE VIEW mill.question_stat AS
  SELECT
    question.id AS id,
    count(1) FILTER (WHERE answer.is_correct = TRUE) as correct_answers,
    count(1) FILTER (WHERE answer.is_correct = FALSE) as incorrect_answers,
    (100.0 / count(1) * (count(1) FILTER (WHERE answer.is_correct = TRUE))) as correct_answer_rate
  FROM mill.question AS question
    JOIN mill.answer AS answer ON question.id = answer.question_id
    JOIN mill.game_answer AS game_answer ON answer.id = game_answer.answer_id
  GROUP BY question.id;

-- Todo: this table introduces redundant data
-- Todo: ... but is required for the admin to be able to delete high score entries
-- Todo: ... without deleting the user/game itself
-- Todo: should we still reference the game?

CREATE TABLE mill.score (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  score INT NOT NULL,
  weighted_score DOUBLE PRECISION NOT NULL,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  game_id BIGINT NULL REFERENCES mill.game (id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX score_game_id ON mill.score (game_id);

CREATE OR REPLACE VIEW mill.scoreboard AS
  SELECT
    score.id,
    game.id as game_id,
    score.score,
    score.weighted_score,
    player.name,
    game.started_at,
    extract(epoch from (game.ended_at::timestamp - game.started_at::timestamp)) as duration
  FROM mill.score AS score
  JOIN mill.game AS game ON score.game_id = game.id
  JOIN mill.player AS player ON game.player_id = player.id
  WHERE score.score > 0
    AND score.hidden = FALSE
  ORDER BY score.score DESC;

