const express = require("express");
const db = require("../db/index");
const quizdb = require("../db/quizzes")
const router = express.Router();

router.route("/")
    .get(async (req, res) => {
        try {
            const result = await db.query("SELECT * FROM quiz");
            res.json(result.rows);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
    .post(async (req, res) => {
        // TODO
    });

router.get("/new", async (req, res) => {
    // TODO
});

router.route("/:id")
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query("SELECT * FROM quiz WHERE id = $1", [
                id
            ]);
            res.json(result.rows);
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
            const result = await db.query("DELETE FROM quiz WHERE id = $1", [
                id
            ]);
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

    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;
