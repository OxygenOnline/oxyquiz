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

        const resultQuery = "SELECT * FROM result WHERE quiz_id = $1";
        const resultResult = await pool.query(resultQuery, [id]);
        const results = resultResult.rows;

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
                options: options
            }

            completeQuestions.push(question);
        }

        const result = {
            "quiz": quiz,
            "category": category,
            "creator": user,
            "questions": completeQuestions,
            "results": results
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

// TODO: cleanup
const updateQuizById = async (id, quiz) => {
    try {

        // TODO: remove questions, results, options that are select * exist but not in the json
        // add new questions, results, options that are not in select * but in json
        // update existing ones
        const results = quiz.results;
        const questions = quiz.questions;

        await pool.query('BEGIN');

        const quizDesc = quiz.description ?? null;
        const quizUpdate = `UPDATE quiz
        SET title = $1,
        description = $2,
        category_id = $3,
        WHERE id = $4`;
        await pool.query(quizUpdate, [quiz.title, quizDesc, quiz.category_id, id]);

        // const resultUpdate = `UPDATE result
        // SET title = $1,
        // description = $2
        // WHERE id = $3
        // AND quiz_id = $4;`;
        
        // const resultQuery = "SELECT id FROM result WHERE question_id = $1";
        // const resultInsert = `INSERT INTO result(quiz_id, title, description)
        // VALUES ($1, $2, $3)
        // RETURNING id;`;
        // const resultDelete = "DELETE FROM result WHERE id = $1 AND question_id = $2";
        // const resultResult = await pool.query(resultQuery, [id]);
        // const existingResult = resultResult.rows.map(item => item.id);

        // for (const r of results) {
        //     const resDesc = r.description ?? null;
        //     if (existingResult.includes(r)) {
        //         await pool.query(resultUpdate, [
        //             r.title,
        //             resDesc,
        //             r.id,
        //             id
        //         ]);
        //     }
        //     else {
        //         await pool.query(resultInsert, [
        //             r.title,
        //             resDesc,
        //         ]);
        //     }
        // }

        // // TODO: validate unique position for:
        // // question, option
        // const questionUpdate = `UPDATE question
        // SET content = $1,
        // position = $2,
        // weight = $3,
        // single_choice = $4
        // WHERE id = $5
        // AND quiz_id = $6;`;

        // const optionUpdate = `UPDATE option
        // SET content = $1,
        // position = $2
        // WHERE id = $3
        // AND question_id = $4`;

        // for (const q of questions) {
        //     await pool.query(questionUpdate, [
        //         q.content,
        //         q.position,
        //         q.weight,
        //         q.single_choice,
        //         q.id,
        //         id
        //     ]);

            for (const o of q.options) {
                // await pool.query(optionUpdate, [
                //     o.content,
                //     o.position,
                //     o.id,
                //     q.position
                // ]);

                const optionResultInsert = `INSERT INTO option_result(option_id, result_id)
                VALUES ($1, $2);`;
                const optionResultDelete = `DELETE FROM option_result
                WHERE option_id = $1
                AND result_id = $2;`;
                
                const optionResultQuery = "SELECT result_id FROM option_result WHERE option_id = $1";
                const optionResultResult = await pool.query(optionResultQuery, [o.id]);
                const existingResults = optionResultResult.rows.map(item => item.result_id);
                
                for (const r of o.result_ids) {
                    if (!existingResults.includes(r)) {
                        await pool.query(optionResultInsert, [o.id, r]);
                    }
                }
                
                for (const r of existingResults) {
                    if (!o.result_ids.includes(r)) {
                        await pool.query(optionResultDelete, [o.id, r]);
                    }
                }
            }
        // }

        await pool.query('COMMIT');
        return getQuizById(id);
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
    updateQuizById,
    deleteQuizById,
    checkQuizExists
};
