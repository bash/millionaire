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
  SELECT MOD(1024 + MOD(nextval(table_id_seq), 1024), 1024)
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
  name VARCHAR(255) NOT NULL
);

CREATE TABLE mill.question (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  title VARCHAR(255) NOT NULL,
  category_id BIGINT NOT NULL REFERENCES mill.category (id)
);

-- Todo: write trigger to ensure there's only one correct answer per question
CREATE TABLE mill.answer (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  title VARCHAR(255) NOT NULL,
  is_correct BOOL NOT NULL,
  question_id BIGINT NOT NULL REFERENCES mill.category (id) ON DELETE CASCADE
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
CREATE TABLE mill.game (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  category_id BIGINT NOT NULL REFERENCES mill.category (id),
  has_used_joker BOOLEAN NOT NULL DEFAULT FALSE,
  player BIGINT NOT NULL REFERENCES mill.player (id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL DEFAULT mill.utc_now(),
  ended_at TIMESTAMP NULL DEFAULT mill.utc_now()
);

CREATE VIEW mill.game_question AS
  SELECT question.* FROM mill.question AS question
  JOIN mill.game AS game ON game.category_id = question.category_id;

-- Todo: use trigger to enforce one answer per (question, game)
CREATE TABLE mill.game_answer (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  game_id BIGINT NOT NULL REFERENCES mill.answer (id) ON DELETE CASCADE,
  answer_id BIGINT NOT NULL REFERENCES mill.answer (id) ON DELETE CASCADE
);

-- Todo: this table introduces redundant
-- Todo: ... but is required for the admin to be able to delete high score entries
-- Todo: ... without deleting the user/game itself
-- Todo: review naming
-- Todo: should we still reference the user?
CREATE TABLE mill.score (
  id BIGINT PRIMARY KEY DEFAULT mill.next_id(),
  player_name VARCHAR(255) NOT NULL,
  score INT NOT NULL
);