-- CREATE DATABASE oxyquiz;

CREATE TABLE IF NOT EXISTS app_user (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    nickname TEXT,
    joining_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id INT REFERENCES category(id) ON DELETE CASCADE NOT NULL,
    creator_id INT REFERENCES app_user(id) ON DELETE CASCADE NOT NULL,
    user_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    position INT NOT NULL CHECK (position >= 0),
    weight INT NOT NULL DEFAULT 1 CHECK (weight >= 1),
    single_choice BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS result (
    id SERIAL PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position INT NOT NULL CHECK (position >= 0),
    user_count INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS option (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES question(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    position INT NOT NULL CHECK (position >= 0)
);

CREATE TABLE IF NOT EXISTS option_result (
    option_id INT REFERENCES option(id) ON DELETE CASCADE NOT NULL,
    result_id INT REFERENCES result(id) ON DELETE CASCADE NOT NULL
);
