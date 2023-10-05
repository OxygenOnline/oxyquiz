const pool = require("./index");


const selectAllRowsById = async (table, idValue, selectFields = ["*"], idColumnName = "id") => {

    try {
        const fields = selectFields.join(', ');
        const query = `SELECT ${fields} FROM ${table} WHERE ${idColumnName} = $1`;

        const result = await pool.query(query, [idValue]);

        return result.rows;
    }
    catch (error) {

        const selectError = new Error(`Error in selecting from ${table} by id ${idValue}: ${error.message}`);
        throw selectError;
    }
};

const selectSingleRowById = async (table, idValue, selectFields = ["*"], idColumnName = "id") => {

    const rows = await selectAllRowsById(table, idValue, selectFields, idColumnName);
    return rows[0];
};

const insertRow = async (table, fields, values, returnId = true) => {

    try {

        if (fields.length !== values.length) {
            throw new Error();
        }

        const fieldNames = fields.join(', ');
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        let query = `INSERT INTO ${table} (${fieldNames}) VALUES (${placeholders})`;

        if (returnId) {
            query += ` RETURNING id`;
        }

        const result = await pool.query(query, values);

        return returnId ? result.rows[0].id : undefined;
    }
    catch (error) {

        const insertError = new Error(`Error inserting row into ${table}: ${error.message}`);
        throw insertError;
    }
};

const getAllQuizzes = async (limit = 20, offset = 0) => {

    const query = "SELECT * FROM quiz LIMIT $1 OFFSET $2";
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
};

const getQuizById = async (quizId) => {

    const quiz = await selectSingleRowById("quiz", quizId);
    const category = await selectSingleRowById("category", quiz.category_id);
    const user = await selectSingleRowById("app_user", quiz.creator_id,
        ["id", "username", "email", "nickname", "joining_date"]);
    const results = await selectAllRowsById("result", quizId,
        ["id", "title", "description", "position"], "quiz_id");
    const questions = await selectAllRowsById("question", quizId,
        ["id", "content", "position", "weight", "single_choice"], "quiz_id");

    let questionsWithOptions = [];
    for (const question of questions) {

        const options = await selectAllRowsById("option", question.id, ["id", "content", "position"], "question_id");
        const questionWithOptions = {
            ...question,
            "options": options
        }

        questionsWithOptions.push(questionWithOptions);
    }

    const response = {
        "quiz": quiz,
        "category": category,
        "creator": user,
        "questions": questionsWithOptions,
        "results": results
    }

    return response;
};

const createQuiz = async (quiz, creator_id) => {

    try {

        const results = quiz.results;
        const questions = quiz.questions;

        await pool.query('BEGIN');

        const quizId = await insertRow("quiz", ["title", "description", "category_id", "creator_id"],
            [quiz.title, quiz.description, quiz.category_id, creator_id]);

        // TODO: map result positions to ids better?
        let resultIdArray = [];
        for (const result of results) {

            const resultId = await insertRow("result", ["quiz_id", "title", "description", "position"],
                [quizId, result.title, result.description, result.position]);

            resultIdArray.splice(result.position, 0, resultId);
        }

        // TODO: validate unique position for:
        // question, option, result
        for (const question of questions) {

            const questionId = await insertRow("question", ["quiz_id", "content", "position", "weight", "single_choice"],
                [quizId, question.content, question.position, question.weight, question.single_choice]);

            for (const option of question.options) {

                const optionId = await insertRow("option", ["question_id", "content", "position"],
                    [questionId, option.content, option.position]);

                for (const optionResult of option.result_ids) {

                    await insertRow("option_result", ["option_id", "result_id"],
                        [optionId, resultIdArray[optionResult]], false);
                }
            }
        }

        await pool.query('COMMIT');

        return quizId;
    }
    catch (error) {

        await pool.query('ROLLBACK');
        throw error;
    }
};

// TODO: cleanup
const updateQuizById = async (id, quiz) => {
    try {

        const results = quiz.results;
        const questions = quiz.questions;

        await pool.query('BEGIN');

        const quizDesc = quiz.description ?? null;
        const quizUpdate = `UPDATE quiz
        SET title = $1,
        description = $2,
        category_id = $3,
        modified_at = NOW()
        WHERE id = $4`;
        await pool.query(quizUpdate, [quiz.title, quizDesc, quiz.category_id, id]);

        const resultUpdate = `UPDATE result
        SET title = $1,
        description = $2,
        position = $3
        WHERE id = $4
        AND quiz_id = $5;`;
        const resultQuery = "SELECT id FROM result WHERE quiz_id = $1";
        const resultInsert = `INSERT INTO result(quiz_id, title, description, position)
        VALUES ($1, $2, $3, $4)
        RETURNING id;`;
        const resultDelete = "DELETE FROM result WHERE id = $1 AND quiz_id = $2;";

        const resultResult = await pool.query(resultQuery, [id]);
        const existingResult = resultResult.rows.map(item => item.id);
        const resultIds = results
            .filter(element => element !== undefined)
            .map(item => item.id);

        for (const r in existingResult) {
            if (!resultIds.includes(r)) {
                await pool.query(resultDelete, [
                    r,
                    id
                ]);
            }
        }

        for (const r of results) {
            const resDesc = r.description ?? null;

            if (r.id !== undefined) {
                await pool.query(resultUpdate, [
                    r.title,
                    resDesc,
                    r.position,
                    r.id,
                    id
                ]);
            }
            else {
                newInsertedResult = await pool.query(resultInsert, [
                    id,
                    r.title,
                    resDesc,
                    r.position
                ]);
            }
        }


        // TODO: validate unique position for:
        // question, option, result
        const questionUpdate = `UPDATE question
        SET content = $1,
        position = $2,
        weight = $3,
        single_choice = $4
        WHERE id = $5
        AND quiz_id = $6;`;
        const questionInsert = `INSERT INTO question(quiz_id, content, position, weight, single_choice)
        VALUES ($1, $2, $3, $4, $5);`;
        const questionQuery = "SELECT id FROM question WHERE quiz_id = $1;";
        const questionDelete = "DELETE FROM question WHERE id = $1 AND quiz_id = $2;";

        const optionUpdate = `UPDATE option
        SET content = $1,
        position = $2
        WHERE id = $3
        AND question_id = $4;`;
        const optionInsert = `INSERT INTO option(question_id, content, position)
        VALUES ($1, $2, $3);`;
        const optionQuery = "SELECT id FROM option WHERE question_id = $1;";
        const optionDelete = "DELETE FROM option WHERE id = $1 AND question_id = $2;";

        const resQuiz = await pool.query(questionQuery, [id]);
        const existingQuestions = resQuiz.rows.map(item => item.id);
        const questionIds = questions
            .filter(element => element !== undefined)
            .map(item => item.id);

        for (const q in existingQuestions) {
            if (!questionIds.includes(q)) {
                await pool.query(questionDelete, [
                    q,
                    id
                ]);
            }
        }

        for (const q of questions) {

            if (q.quiz_id !== id) {
                continue;
            }

            if (r.id !== undefined) {
                await pool.query(questionUpdate, [
                    q.content,
                    q.position,
                    q.weight,
                    q.single_choice
                ]);
            }
            else {
                await pool.query(questionInsert, [
                    id,
                    q.content,
                    q.position,
                    q.weight,
                    q.single_choice
                ]);
            }

            const resOptions = await pool.query(optionQuery, [q.id]);
            const existingOptions = resOptions.rows.map(item => item.id);
            const optionIds = q.options.rows.map(item => item.id);

            for (const o in existingOptions) {
                if (!optionIds.includes(o)) {
                    await pool.query(optionDelete, [
                        o.id,
                        q.id
                    ]);
                }
            }

            for (const o of q.options) {

                if (o.id !== undefined) {
                    await pool.query(optionUpdate, [
                        o.content,
                        o.position,
                        o.id,
                        q.position
                    ]);
                }
                else {
                    await pool.query(optionInsert, [
                        q.position,
                        o.content,
                        o.position
                    ]);
                }

                const optionResultInsert = `INSERT INTO option_result(option_id, result_id)
                VALUES ($1, $2);`;
                const optionResultDelete = `DELETE FROM option_result
                WHERE option_id = $1
                AND result_id = $2;`;

                const optionResultQuery = "SELECT result_id FROM option_result WHERE option_id = $1";
                const optionResultResult = await pool.query(optionResultQuery, [o.id]);
                const existingResults = optionResultResult.rows.map(item => item.result_id);

                const newQuery = "SELECT id from result WHERE quiz_id = $1 and position = $2 RETURNING id;"
                let newResults = [];

                for (r in o.result_ids.rows) {
                    const res = await pool.query(newQuery, [id, r]);
                    newResults.push(res.rows[0]);
                }

                // TODO: rename in schema, code and test data option.result_ids to result_positions
                // or change result-option mapping

                for (const r of existingResults) {
                    if (!newResults.includes(r)) {
                        await pool.query(optionResultDelete, [o.id, r]);
                    }
                }

                for (const r of newResults) {
                    if (!existingResults.includes(r)) {
                        await pool.query(optionResultInsert, [o.id, r]);
                    }
                }
            }
        }

        await pool.query('COMMIT');
        return getQuizById(id);
    }
    catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
}

const deleteQuizById = async (quizId) => {

    const queryText = "DELETE FROM quiz WHERE id = $1";
    await pool.query(queryText, [quizId]);
};

const checkQuizExists = async (quizId) => {

    const query = 'SELECT COUNT(*) FROM quiz WHERE id = $1';
    const result = await pool.query(query, [quizId]);

    return Number(result.rows[0].count) === 1;
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuizById,
    deleteQuizById,
    checkQuizExists
};
