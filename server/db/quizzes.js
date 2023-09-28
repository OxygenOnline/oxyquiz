const pool = require("./index");

// TODO: refactor
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
        const quizQuery = "SELECT * FROM quiz WHERE id = $1";
        const quizResult = await pool.query(quizQuery, [id]);
        const quiz = quizResult.rows[0];

        const categoryQuery = "SELECT * FROM category WHERE id = $1";
        const categoryResult = await pool.query(categoryQuery, [quiz.category_id]);
        const category = categoryResult.rows[0];

        const userQuery = "SELECT id, username, email, nickname, joining_date FROM app_user WHERE id = $1";
        const userResult = await pool.query(userQuery, [quiz.creator_id]);
        const user = userResult.rows[0];

        const questionQuery = "SELECT * FROM question WHERE quiz_id = $1";
        const questionResult = await pool.query(questionQuery, [id]);
        const questions = questionResult.rows;

        const optionQuery = "SELECT * FROM option WHERE question_id = $1";

        let completeQuestions = []
        for (const q of questions) {
            const optionResult = await pool.query(optionQuery, [q.id]);
            const options = optionResult.rows;

            const question = {
                id: q.id,
                content: q.content,
                position: q.position,
                single_choice: q.single_choice,
                options: options,
            }

            completeQuestions.push(question);
        }

        const result = {
            "quiz": quiz,
            "category": category,
            "creator": user,
            "questions": completeQuestions
        }

        return result;
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

        await pool.query('BEGIN');

        const quizInsert = `INSERT INTO quiz(title, description, category_id, creator_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;`;
        const quizResult = await pool.query(quizInsert, [quiz.title, quiz.description, quiz.category_id, creator_id]);
        const quizId = quizResult.rows[0].id;

        let resultIdArray = [];
        const resultInsert = `INSERT INTO result(quiz_id, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;`;
        for (const r of results) {
            let resultResult = await pool.query(resultInsert, [
                quizId,
                r.title,
                r.description
            ]);
            const resultId = resultResult.rows[0].id;
            resultIdArray.push(resultId);
        }

        // TODO: validate unique position for:
        // question, option
        const questionInsert = `INSERT INTO question(quiz_id, content, position, weight, single_choice)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;`;
        const optionInsert = `INSERT INTO option(question_id, content, position)
        VALUES ($1, $2, $3)
        RETURNING id;`;
        const optionResultInsert = `INSERT INTO option_result(option_id, result_id)
        VALUES ($1, $2);`;
        for (const q of questions) {
            const questionResult = await pool.query(questionInsert, [
                quizId,
                q.content,
                q.position,
                q.weight,
                q.single_choice,
            ]);
            const questionId = questionResult.rows[0].id;

            for (const o of q.options) {
                const optionResult = await pool.query(optionInsert, [
                    questionId,
                    o.content,
                    o.position
                ]);
                const optionId = optionResult.rows[0].id;

                for (const r_o of o.result_ids) {
                    await pool.query(optionResultInsert, [
                        optionId,
                        resultIdArray[r_o]
                    ]);
                }
            }
        }

        await pool.query('COMMIT');

        return quizId;
    }
    catch (error) {
        await pool.query('ROLLBACK');
        console.error(error.message);
        throw error;
    }
};

// TODO
const updateQuiz = async (id, quiz) => {
    try {

        const results = quiz.results;
        const questions = quiz.questions;

        await pool.query('BEGIN');

        const quizUpdate = `UPDATE quiz
        SET title = $1,
        description = $2,
        category_id = $3,
        WHERE id = $4`;
        await pool.query(quizUpdate, [quiz.title, quiz.description, quiz.category_id, id]);

        let resultIdArray = [];
        const resultInsert = `UPDATE result(quiz_id, title, description)
        VALUES ($1, $2, $3)
        RETURNING id;`;
        for (const r of results) {
            let resultResult = await pool.query(resultInsert, [
                quizId,
                r.title,
                r.description
            ]);
            const resultId = resultResult.rows[0].id;
            resultIdArray.push(resultId);
        }

        // TODO: validate unique position for:
        // question, option
        const questionInsert = `UPDATE question(quiz_id, content, position, weight, single_choice)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;`;
        const optionInsert = `UPDATE option(question_id, content, position)
        VALUES ($1, $2, $3)
        RETURNING id;`;
        const optionResultInsert = `UPDATE option_result(option_id, result_id)
        VALUES ($1, $2);`;
        for (const q of questions) {
            const questionResult = await pool.query(questionInsert, [
                quizId,
                q.content,
                q.position,
                q.weight,
                q.single_choice,
            ]);
            const questionId = questionResult.rows[0].id;

            for (const o of q.options) {
                const optionResult = await pool.query(optionInsert, [
                    questionId,
                    o.content,
                    o.position
                ]);
                const optionId = optionResult.rows[0].id;

                for (const r_o of o.result_ids) {
                    await pool.query(optionResultInsert, [
                        optionId,
                        resultIdArray[r_o]
                    ]);
                }
            }
        }

        await pool.query('COMMIT');

        return quizId;
    }
    catch (error) {
        await pool.query('ROLLBACK');
        console.error(error.message);
        throw error;
    }

}

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
    updateQuiz,
    deleteQuizById,
    checkQuizExists
};
