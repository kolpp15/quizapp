DROP TABLE IF EXISTS questions CASCADE;
CREATE TABLE questions (
  id SERIAL PRIMARY KEY NOT NULL,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL
<<<<<<< HEAD
);
=======
);
>>>>>>> 76e3c660d74d990314f8ddfc841c0cbf9c6e8958
