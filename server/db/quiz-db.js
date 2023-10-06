const query = require('./db-utils');


const selectQuizzes = async (limit, offset) => {
    const quizzes = await query.selectAllRowsById("quiz",
        undefined, undefined, undefined, limit, offset);
    return quizzes;
};

const selectQuiz = async (quizId) => {
    const quiz = await query.selectSingleRowById("quiz", quizId);
    return quiz;
};

const selectCategory = async (categoryId) => {
    const category = await query.selectSingleRowById("category", categoryId);
    return category;
};

const selectUser = async (userId) => {
    const user = await query.selectSingleRowById("app_user", userId,
        ["id", "username", "email", "nickname", "joining_date"]);
    return user;
};

const selectResults = async (quizId) => {
    const results = await query.selectAllRowsById("result", quizId,
        ["id", "title", "description", "position"], "quiz_id");
    return results;
};

const selectQuestions = async (quizId) => {
    const questions = await query.selectAllRowsById("question", quizId,
        ["id", "content", "position", "weight", "single_choice"], "quiz_id");
    return questions;
};

const selectOptions = async (questionId) => {
    const options = await query.selectAllRowsById("option", questionId,
        ["id", "content", "position"], "question_id");
    return options;
};

const selectOptionResults = async (optionId) => {
    const optionResults = await query.selectAllRowsById("option_result", optionId,
        ["result_id"], ["option_id"]);
    return optionResults;
};

const insertQuiz = async (quiz) => {
    const quizId = await query.insertRow("quiz",
        ["title", "description", "category_id", "creator_id"],
        quiz);
    return quizId;
};

const insertResult = async (result) => {
    const resultId = await query.insertRow("result",
        ["quiz_id", "title", "description", "position"],
        result);
    return resultId;
};

const insertQuestion = async (question) => {
    const questionId = await query.insertRow("question",
        ["quiz_id", "content", "position", "weight", "single_choice"],
        question);
    return questionId;
};

const insertOption = async (option) => {
    const optionId = await query.insertRow("option",
        ["question_id", "content", "position"],
        option);
    return optionId;
};

const insertOptionResult = async (optionResult) => {
    await query.insertRow("option_result", ["option_id", "result_id"],
        optionResult, false);
};

const updateQuiz = async (quizId, quiz) => {
    await query.updateRow("quiz", ["title", "description", "category_id", "modified_at"],
        [...quiz, "NOW()"], quizId);
};

const updateResult = async (ids, result) => {
    await query.updateRow("result", ["title", "description", "position"],
        result, ids, ["id", quiz_id]);
};

const updateQuestion = async (ids, question) => {
    await query.updateRow("question", ["content", "position", "weight", "single_choice"],
        question, ids, ["id", quiz_id]);
};

const updateOption = async (ids, option) => {
    await query.updateRow("option", ["content", "position"],
        option, ids, ["id", question_id]);
};

const deleteQuiz = async (quizId) => {
    await query.deleteRow("quiz", [quizId])
};

const deleteResult = async (ids) => {
    await query.deleteRow("result", ids, ["id", "quiz_id"]);
};

const deleteQuestion = async (ids) => {
    await query.deleteRow("question", ids, ["id", "quiz_id"]);
};

const deleteOption = async (ids) => {
    await query.deleteRow("option", ids, ["id", "question_id"]);
};

const deleteOptionResult = async (ids) => {
    await query.deleteRow("option_result", ids, ["option_id", "result_id"]);
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

    const result = await selectQuizzes(limit, offset);
    return result;
};

const getQuizById = async (quizId) => {

    const quiz = await selectQuiz(quizId);
    const category = await selectCategory(quiz.category_id);
    const user = await selectUser(quiz.creator_id);
    const results = await selectResults(quizId);
    const questions = await selectQuestions(quizId);

    let questionsWithOptions = [];
    for (const question of questions) {

        const options = await selectOptions(question.id);
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

const createQuiz = async (quiz, creatorId) => {

    try {

        const results = quiz.results;
        const questions = quiz.questions;

        await query.beginTransaction();

        const quizId = await insertQuiz(
            [quiz.title, quiz.description, quiz.category_id, creatorId]);

        checkValidPositions(results);
        let resultIdArray = [];
        for (const result of results) {

            result.description = result.description ?? null;
            const resultId = await insertResult(
                [quizId, result.title, result.description, result.position]);

            resultIdArray.splice(result.position, 0, resultId);
        }

        checkValidPositions(questions);
        for (const question of questions) {

            const questionId = await insertQuestion(
                [quizId, question.content, question.position, question.weight, question.single_choice]);

            checkValidPositions(question.options);
            for (const option of question.options) {

                const optionId = await insertOption(
                    [questionId, option.content, option.position]);

                for (const optionResult of option.result_positions) {

                    await insertOptionResult([optionId, resultIdArray[optionResult]]);
                }
            }
        }

        await query.commitTransaction();
        return quizId;
    }
    catch (error) {

        await query.rollbackTransaction();
        throw error;
    }
};

const updateQuizById = async (quizId, quiz) => {

    try {

        const results = quiz.results;
        const questions = quiz.questions;

        await query.beginTransaction();

        quiz.description = quiz.description ?? null;
        await updateQuiz([quizId],
            [quiz.title, quiz.description, quiz.category_id]);

        checkValidPositions(results);
        let dbRows = await selectResults(quizId);
        let toBeDeleted = removableIds(results, dbRows);
        for (const deletableId of toBeDeleted) {

            await deleteResult([deletableId, quizId]);
        }

        let resultIdArray = [];
        for (const result of results) {

            result.description = result.description ?? null;
            if (result.id === undefined) {

                result.id = await insertResult(
                    [quizId, result.title, result.description, result.position]);
            }
            else {

                if (result.quiz_id !== quizId) {
                    continue;
                }

                await updateResult([result.id, quizId],
                    [result.title, result.description, result.position]);
            }

            resultIdArray.splice(result.position, 0, result.id);
        }

        checkValidPositions(questions);
        dbRows = await selectQuestions(quizId);
        toBeDeleted = removableIds(questions, dbRows);
        for (const deletableId of toBeDeleted) {

            await deleteQuestion([deletableId, quizId]);
        }

        for (const question of questions) {

            if (question.id === undefined) {

                question.id = await insertQuestion(
                    [quizId, question.content, question.position, question.weight, question.single_choice]);
            }
            else {

                if (question.quiz_id !== quizId) {
                    continue;
                }

                await updateQuestion([question.id, quizId],
                    [question.content, question.position, question.weight, question.single_choice]);
            }

            const options = question.options
            checkValidPositions(options);
            dbRows = await selectOptions(question.id);
            toBeDeleted = removableIds(options, dbRows);
            for (const deletableId of toBeDeleted) {

                await deleteOption([deletableId, question.id]);
            }

            for (const option of options) {

                if (option.id === undefined) {

                    option.id = await insertOption(
                        [question.id, option.content, option.position]);
                }
                else {

                    if (option.question_id !== question.id) {
                        continue;
                    }

                    await updateOption([option.id, quizId],
                        [option.content, option.position]);
                }

                dbRows = await selectOptionResults(option.id);
                optionResults = option.result_positions
                    .map(index => resultIdArray[index])
                    .filter(resultId => resultId !== undefined && resultId !== null);

                for (const oldId of dbRows) {

                    if (!optionResults.includes(oldId)) {
                        await deleteOptionResult([option.id, oldId]);
                    }
                }

                for (const newId of optionResults) {

                    if (!dbRows.includes(newId)) {
                        await insertOptionResult([option.id, newId]);
                    }
                }
            }
        }

        await query.commitTransaction();
        return getQuizById(quizId);
    }
    catch (error) {

        await query.rollbackTransaction();
        throw error;
    }
}

const deleteQuizById = async (quizId) => {

    await deleteQuiz(quizId);
};

const checkQuizExists = async (quizId) => {

    const result = await query.countRows("quiz", quizId);
    return result;
};

module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuizById,
    deleteQuizById,
    checkQuizExists
};
