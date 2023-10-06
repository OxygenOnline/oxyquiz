const pool = require("./index");

// TODO: extract all queries into their own function, with one array arg that takes in the values, tablename and filedname are constants
// generic queries into own file
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

const updateRow = async (table, fields, values, id) => {

    try {

        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $${fields.length + 1}`;

        await pool.query(query, [...values, id]);
    }
    catch (error) {

        const updateError = new Error(`Error updating ${table} row with ID ${id}: ${error.message}`);
        throw updateError;
    }
};

const deleteRow = async (table, conditionValues, conditionFields = ["id"]) => {

    try {

        if (conditionFields.length !== conditionValues.length) {
            throw new Error();
        }

        const whereClauses = conditionFields.map((field, index) => `${field} = $${index + 1}`).join(' AND ');
        const query = `DELETE FROM ${table} WHERE ${whereClauses}`;

        await pool.query(query, conditionValues);
    }
    catch (error) {

        const deleteError = new Error(`Error deleting row from ${table}: ${error.message}`);
        throw deleteError;
    }
};

const removableIds = (newArray, oldArray) => {

    const existingIds = oldArray.map(item => item.id);
    const newIds = newArray
        .filter(item => item && item.id !== undefined && item.id !== null)
        .map(item => item.id);
    const ids = existingIds.filter(id => !newIds.includes(id));
    return ids;
}

const checkValidPositions = (array) => {

    const positionsSet = new Set();

    array.filter(({ position }) => {

        if (position < 0 || position >= array.length || positionsSet.has(position)) {
            throw new Error(`Invalid or duplicate position found with value ${position}`);
        }

        positionsSet.add(position);
    });
};

const getAllQuizzes = async (limit = 20, offset = 0) => {

    const query = "SELECT * FROM quiz LIMIT $1 OFFSET $2";
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
};

const getQuizById = async (quizId) => {

    const quiz = await selectSingleRowById("quiz", quizId,
        ["title", "description"]);
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

        checkValidPositions(results);
        let resultIdArray = [];
        for (const result of results) {

            const resultDescription = result.description ?? null;
            const resultId = await insertRow("result", ["quiz_id", "title", "description", "position"],
                [quizId, result.title, resultDescription, result.position]);

            resultIdArray.splice(result.position, 0, resultId);
        }

        checkValidPositions(questions);
        for (const question of questions) {

            const questionId = await insertRow("question",
                ["quiz_id", "content", "position", "weight", "single_choice"],
                [quizId, question.content, question.position, question.weight, question.single_choice]);

            checkValidPositions(question.options);
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

const updateQuizById = async (quizId, quiz) => {

    try {

        const results = quiz.results;
        const questions = quiz.questions;

        await pool.query('BEGIN');

        const quizDesc = quiz.description ?? null;
        await updateRow("quiz", ["title", "description", "category_id", "modified_at"],
            [quiz.title, quizDesc, quiz.category_id, "NOW()"], quizId);

        checkValidPositions(results);
        let dbRows = await selectAllRowsById("result", quizId,
            ["id", "title", "description", "position"], "quiz_id");
        let toBeDeleted = removableIds(results, dbRows);
        for (const deletableId of toBeDeleted) {

            await deleteRow("result", [deletableId, quizId], ["id", "quiz_id"]);
        }

        let resultIdArray = [];
        for (const result of results) {

            const resultDescription = result.description ?? null;
            if (result.id === undefined) {

                result.id = await insertRow("result", ["quiz_id", "title", "description", "position"],
                    [quizId, result.title, resultDescription, result.position]);
            }
            else {

                if (result.quiz_id !== quizId) {
                    continue;
                }

                await updateRow("result", ["title", "description", "position"],
                    [result.title, resultDescription, result.position], result.id)
            }

            resultIdArray.splice(result.position, 0, result.id);
        }

        checkValidPositions(questions);
        dbRows = await selectAllRowsById("question", quizId,
            ["id", "content", "position", "weight", "single_choice"], "quiz_id");
        toBeDeleted = removableIds(questions, dbRows);
        for (const deletableId of toBeDeleted) {

            await deleteRow("question", [deletableId, quizId], ["id", "quiz_id"]);
        }

        for (const question of questions) {

            if (question.id === undefined) {

                question.id = await insertRow("question", ["quiz_id", "content", "position", "weight", "single_choice"],
                    [quizId, question.content, question.position, question.weight, question.single_choice]);
            }
            else {

                if (question.quiz_id !== quizId) {
                    continue;
                }

                await updateRow("question", ["content", "position", "weight", "single_choice"],
                    [question.content, question.position, question.weight, question.single_choice], question.id);
            }

            const options = question.options
            checkValidPositions(options);
            dbRows = await selectAllRowsById("option", question.id,
                ["id", "content", "position"], "question_id");
            toBeDeleted = removableIds(options, dbRows);
            for (const deletableId of toBeDeleted) {

                await deleteRow("option", [deletableId, question.id], ["id", "question_id"]);
            }

            for (const option of options) {

                if (option.id === undefined) {

                    option.id = await insertRow("option", ["question_id", "content", "position"],
                        [question.id, option.content, option.position]);
                }
                else {

                    if (option.question_id !== question.id) {
                        continue;
                    }

                    await updateRow("option", ["content", "position"],
                        [option.content, option.position], option.id);
                }

                dbRows = await selectAllRowsById("option_result", option.id, ["result_id AS id"], ["option_id"]);
                optionResults = option.result_ids
                    .map(index => resultIdArray[index])
                    .filter(resultId => resultId !== undefined && resultId !== null);

                for (const oldId of dbRows) {

                    if (!optionResults.includes(oldId)) {
                        await deleteRow("option_result", [option.id, oldId], ["option_id", "result_id"]);
                    }
                }

                for (const newId of optionResults) {

                    console.log(newId);
                    if (!dbRows.includes(newId)) {
                        await insertRow("option_result", ["option_id", "result_id"], [option.id, newId], false);
                    }
                }
                // TODO: rename in schema, code and test data option.result_ids to result_positions
            }
        }

        await pool.query('COMMIT');

        return getQuizById(quizId);
    }
    catch (error) {

        await pool.query('ROLLBACK');
        throw error;
    }
}

const deleteQuizById = async (quizId) => {

    await deleteRow("quiz", [quizId])
};

const checkQuizExists = async (quizId) => {

    const query = 'SELECT COUNT(*) FROM quiz WHERE id = $1';
    const result = await pool.query(query, [quizId]);

    return Number(result.rows[0].count) !== 0;
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuizById,
    deleteQuizById,
    checkQuizExists
};
