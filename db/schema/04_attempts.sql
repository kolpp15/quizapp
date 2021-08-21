DROP TABLE IF EXISTS attempts CASCADE;
CREATE TABLE attempts (
id SERIAL PRIMARY KEY NOT NULL,
result_id INTEGER REFERENCES results(id) ON delete CASCADE,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE
);
