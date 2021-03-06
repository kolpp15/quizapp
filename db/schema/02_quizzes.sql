-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title  VARCHAR(255) NOT NULL,
  is_private BOOLEAN NOT NULL
);
