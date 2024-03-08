const createError = require('http-errors');
const quizdb = require('../database/quiz');
const logger = require('../utils/logger');


const getAllQuizzes = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const result = await quizdb.getAllQuizzes(limit, offset);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getQuizCount = async (req, res, next) => {
    try {
        const number = await quizdb.getNumberOfQuizzes();
        res.json(number);
    }
    catch (error) {
        next(error);
    }
};

const getFullQuizById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const isCreator = await quizdb.checkCreator(id, userId);
        if (!isCreator) {
            return res.status(403).json({ message: 'Unauthorized: You cannot access this quiz' });
        }
        const result = await quizdb.getFullQuizById(id);
        res.json(result);
    }
    catch (error) {
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
        const { limit, offset } = req.query;
        const result = await quizdb.getAllQuizzesByCategory(categoryName, limit, offset);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getQuizCountByCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params;
        const number = await quizdb.getNumberOfQuizzesByCategory(categoryName);
        res.json(number);
    }
    catch (error) {
        next(error);
    }
};

const getAllQuizzesByUser = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const userId = req.user.id;
        const result = await quizdb.getAllQuizzesByUser(userId, limit, offset);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};

const getQuizCountByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const number = await quizdb.getNumberOfQuizzesByUser(userId);
        res.json(number);
    }
    catch (error) {
        next(error);
    }
};

const createQuiz = async (req, res, next) => {
    try {
        const { quiz } = req.body;
        const quizId = await quizdb.createQuiz(quiz, req.user.id);
        logger.verbose(`Created quiz [${quizId}]`);
        res.status(201).json(quizId);
    }
    catch (error) {
        next(error);
    }
};

const updateQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newQuiz = req.body.quiz;
        const userId = req.user.id;

        const isCreator = await quizdb.checkCreator(id, userId);
        if (!isCreator) {
            return res.status(403).json({ message: 'Unauthorized: You cannot update this quiz' });
        }
        const quizId = await quizdb.updateQuizById(id, newQuiz);
        logger.verbose(`Updated quiz [${quizId}]`);
        res.json(quizId);
    }
    catch (error) {
        next(error);
    }
};

const deleteQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const isCreator = await quizdb.checkCreator(id, userId);
        if (!isCreator) {
            return res.status(403).json({ message: 'Unauthorized: You cannot delete this quiz' });
        }
        await quizdb.deleteQuizById(id);
        logger.verbose(`Deleted quiz [${id}]`);
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
        const result = await quizdb.getRandomQuiz(categoryName);
        res.json(result);
    }
    catch (error) {
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

const checkValidCategory = async (req, res, next, categoryPathName) => {

    try {
        const isValidCategory = await quizdb.categoryExists(categoryPathName);
        if (!isValidCategory) {
            return next(createError(404, `Category with given name "${categoryPathName}" does not exist.`));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    getAllQuizzes,
    getQuizCount,
    getAllQuizzesByCategory,
    getQuizCountByCategory,
    getAllQuizzesByUser,
    getQuizCountByUser,
    getFullQuizById,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getRandomQuiz,
    getRandomQuizWithCategory,
    getResultEvaluation,
    checkValidQuizId,
    checkValidCategory
};
