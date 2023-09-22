const pool = require("./index");

const getAllQuizzes = async (limit = 20, offset = 0) => {

    try {
        const queryText = "SELECT * FROM quiz LIMIT $1 OFFSET $2";
        const result = await pool.query(queryText, [limit, offset]);
        return result.rows;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const getQuizById = async (id) => {

    try {
        const queryText = "SELECT * FROM quiz WHERE id = $1";
        const result = await pool.query(queryText, [id]);
        return result.rows[0];
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const createQuiz = async (quiz, creator_id) => {

    try {

        const results = quiz.results;
        const questions = quiz.questions;

        const quizInsert = `INSERT INTO quiz(title, description, category_id, creator_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;`;
        const quizResult = await pool.query(quizInsert, [quiz.title, quiz.description, quiz.category_id, creator_id]);
        const quizId = quizResult.rows[0].id;
        
        const questionInsert = `INSERT INTO question(quiz_id, content, position, weight, single_choice)
        VALUES ($1, $2, $3, $4, $5);`;
        for (const q of questions) {
            await pool.query(questionInsert, [
                quizId,
                q.content,
                q.position,
                q.weight,
                q.single_choice,
            ]);
        }
        
        const resultInsert = `INSERT INTO result(quiz_id, title, description)
        VALUES ($1, $2, $3);`;
        for (const r of results) {
            await pool.query(resultInsert, [
                quizId,
                r.title,
                r.description
            ]);
        }
        
        return quizId;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const deleteQuizById = async (id) => {

    try {
        const queryText = "DELETE FROM quiz WHERE id = $1";
        await pool.query(queryText, [id]);
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

const checkQuizExists = async (id) => {

    try {
        const queryText = "SELECT * FROM quiz WHERE id = $1 LIMIT 1";
        const { rowCount } = await pool.query(queryText, [id]);

        if (rowCount === 0) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    deleteQuizById,
    checkQuizExists
};
