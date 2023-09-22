const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const { Validator } = require("express-json-validator-middleware");

const quizdb = require("../db/quizzes")

const quizSchema = require('../schemas/quiz.json');
const { validate } = new Validator();

router.route("/")
    .get(async (req, res) => {
        try {
            const result = await quizdb.getAllQuizzes();
            res.json(result);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
    .post(validate({ body: quizSchema }), async (req, res) => {
        try {
            const quiz = req.body.quiz;
            const quizId = await quizdb.createQuiz(quiz, 1001);
            res.json(quizId);
            // TODO: options in questions, option-result?
            // return the quiz appropriately
            // validate position unique
            // validate enough options
            // rollback if sql doesnt finish
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    });

router.get("/new", async (req, res) => {
    // TODO
});

router.route("/:id(\\d+)")
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const result = await quizdb.getQuizById(id);
            res.json(result);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
    .put(async (req, res) => {
        try {
            // TODO
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
    .delete(async (req, res) => {
        try {
            const { id } = req.params;
            await quizdb.deleteQuizById(id)
            res.json(`Deleted quiz by id ${id}.`);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    });

router.param("id", async (req, res, next, id) => {

    try {
        const isValidQuiz = await quizdb.checkQuizExists(id);

        if (!isValidQuiz) {
            return res.status(404).send(`Quiz with given id ${id} does not exist.`);
        }
        next();
    }
    catch (error) {
        console.error(error.message);
        throw error;
    }
});

module.exports = router;
