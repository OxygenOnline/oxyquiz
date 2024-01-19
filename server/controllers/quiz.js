const createError = require('http-errors');
const quizdb = require('../database/quiz');


const validateCategoryPathName = async (categoryPathName) => {
    const isValidCategory = await quizdb.categoryExists(categoryPathName);
    if (!isValidCategory) {
        throw Error(createError(404, `Category with given name "${categoryPathName}" does not exist.`));
    }
};

const getAllQuizzes = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const result = await quizdb.getAllQuizzes(limit, offset);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getQuizById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await quizdb.getQuizById(id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getAllQuizzesByCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params;
        await validateCategoryPathName(categoryName);
        const { limit, offset } = req.query;
        const result = await quizdb.getAllQuizzesByCategory(categoryName, limit, offset);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getAllQuizzesByUser = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const userId = req.user.id
        const result = await quizdb.getAllQuizzesByUser(userId, limit, offset);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const createQuiz = async (req, res, next) => {
    try {
        const { quiz } = req.body;
        const quizId = await quizdb.createQuiz(quiz, req.user.id);
        res.status(201).json(quizId);
    } catch (error) {
        next(error);
    }
};

const updateQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newQuiz = req.body.quiz;
        const userId = req.user.id
        const oldQuiz = await quizdb.getQuizById(id);
        if (oldQuiz.creator.id !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You cannot update this quiz' });
        }
        const quizId = await quizdb.updateQuizById(id, newQuiz);
        res.json(quizId);
    }
    catch (error) {
        next(error);
    }
};

const deleteQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id
        const quiz = await quizdb.getQuizById(id);
        if (quiz.creator.id !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You cannot delete this quiz' });
        }
        await quizdb.deleteQuizById(id);
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
};

const getRandomQuiz = async (req, res, next) => {
    try {
        const result = await quizdb.getRandomQuiz();
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getRandomQuizWithCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params;
        await validateCategoryPathName(categoryName);
        const result = await quizdb.getRandomQuiz(categoryName);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const getResultEvaluation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const answers = req.body.answers;
        const result = await quizdb.evaluateResult(Number(id), answers);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const checkValidQuizId = async (req, res, next, quizId) => {

    try {
        const isValidQuiz = await quizdb.quizExists(quizId);
        if (!isValidQuiz) {
            return next(createError(404, `Quiz with given id ${quizId} does not exist.`));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getAllQuizzes,
    getAllQuizzesByCategory,
    getAllQuizzesByUser,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getRandomQuiz,
    getRandomQuizWithCategory,
    getResultEvaluation,
    checkValidQuizId
};
