const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { Validator } = require('express-json-validator-middleware');

const quizdb = require('../database/quiz');

const quizSchema = require('../schemas/quiz.json');
const evaluationSchema = require('../schemas/evaluation.json');
const { validate } = new Validator();

// TODO: user
router.route('/')
    .get(async (req, res, next) => {
        try {
            const result = await quizdb.getAllQuizzes();
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    })
    .post(validate({ body: quizSchema }), async (req, res, next) => {
        try {
            const quiz = req.body.quiz;
            const quizId = await quizdb.createQuiz(quiz, 1001);
            res.status(201).json(quizId);
        }
        catch (error) {
            next(error);
        }
    });

router.route('/random')
    .get(async (req, res, next) => {
        try {
            const result = await quizdb.getRandomQuiz();
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    });

router.route('/:categoryName/random')
    .get(async (req, res, next) => {
        try {
            const { categoryName } = req.params;
            await validateCategoryPathName(categoryName);
            const result = await quizdb.getRandomQuiz(categoryName);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    });

router.route('/:id(\\d+)')
    .get(async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await quizdb.getQuizById(id);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    })
    .post(validate({ body: evaluationSchema }), async (req, res, next) => {
        try {
            const { id } = req.params;
            const answers = req.body.answers;
            const result = await quizdb.evaluateResult(Number(id), answers);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    })
    .put(validate({ body: quizSchema }), async (req, res, next) => {
        try {
            const { id } = req.params;
            const quiz = req.body.quiz;
            const quizId = await quizdb.updateQuizById(id, quiz);
            res.json(quizId);
        }
        catch (error) {
            next(error);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const { id } = req.params;
            await quizdb.deleteQuizById(id);
            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    });
    
router.route('/:categoryName')
    .get(async (req, res, next) => {
        try {
            const { categoryName } = req.params;
            await validateCategoryPathName(categoryName);
            const result = await quizdb.getAllQuizzesByCategory(categoryName);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    });

router.param('id', async (req, res, next, quizId) => {

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
});

const validateCategoryPathName = async (categoryPathName) => {

    const isValidCategory = await quizdb.categoryExists(categoryPathName);

    if (!isValidCategory) {
        throw Error(createError(404, `Category with given name "${categoryPathName}" does not exist.`));
    }
};

module.exports = router;
