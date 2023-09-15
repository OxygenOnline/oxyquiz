const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM quiz");
        res.json(result.rows);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
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

module.exports = router;
