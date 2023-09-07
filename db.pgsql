CREATE TABLE app_user (
    id serial PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    nickname VARCHAR(50),
    joining_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE category (
    id serial PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE quiz (
    id serial PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    category_id INT REFERENCES category(id) NOT NULL,
    creator_id INT REFERENCES app_user(id) NOT NULL,
    -- user_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW()
);

-- CREATE TABLE tag (
--     id serial PRIMARY KEY,
--     name VARCHAR(50) UNIQUE NOT NULL
-- );

-- CREATE TABLE quiz_tag (
--     quiz_id INT REFERENCES quiz(id) NOT NULL,
--     tag_id INT REFERENCES tag(id) NOT NULL
-- );

CREATE TABLE question (
    id serial PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id) NOT NULL,
    text VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    single_choice INT DEFAULT 0
);

CREATE TABLE result (
    id serial PRIMARY KEY,
    quiz_id INT REFERENCES quiz(id) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255)
    -- , user_count INT DEFAULT 0
);

CREATE TABLE option (
    id serial PRIMARY KEY,
    question_id INT REFERENCES question(id) NOT NULL,
    text VARCHAR(100) NOT NULL,
    position INT NOT NULL,
    result_id INT REFERENCES result(id) NOT NULL,
    weight INT DEFAULT 1
);
