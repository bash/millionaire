CREATE OR REPLACE FUNCTION insert_question(
    question VARCHAR(255),
    correct_answer VARCHAR(255),
    incorrect_answer_1 VARCHAR(255),
    incorrect_answer_2 VARCHAR(255),
    category VARCHAR(255)
  )
  RETURNS VOID AS $$
  DECLARE
    category_id BIGINT;
    question_id BIGINT;
  BEGIN
    INSERT INTO mill.category (name)
      VALUES (category)
      ON CONFLICT (name) DO NOTHING
      RETURNING id INTO category_id;

    INSERT INTO mill.question (title, category_id)
      VALUES (question, category_id)
      RETURNING id INTO question_id;

    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (correct_answer, TRUE, question_id);
    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (incorrect_answer_1, FALSE, question_id);
    INSERT INTO mill.answer (title, is_correct, question_id) VALUES (incorrect_answer_2, FALSE, question_id);
  END;
  $$ LANGUAGE PLPGSQL;


SELECT insert_question('Wie grüssen Mitglieder des Ferner Fanclubs?', 'Hoi Nils', 'Heil Nils', 'Sali Jan', 'BBB');