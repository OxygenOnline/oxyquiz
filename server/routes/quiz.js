const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const { Validator } = require("express-json-validator-middleware");

const quizdb = require("../db/quiz-db")

const quizSchema = require('../schemas/quiz.json');
const { validate } = new Validator();

// TODO: user
router.route("/")
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

router.get("/new", async (req, res, next) => {
    // TODO
});

router.route("/:id(\\d+)")
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
            await quizdb.deleteQuizById(id)
            res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    });

router.param("id", async (req, res, next, id) => {

    try {
        const isValidQuiz = await quizdb.checkQuizExists(id);

        if (!isValidQuiz) {
            return next(createError(404, `Quiz with given id ${id} does not exist.`));
        }
        next();
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
