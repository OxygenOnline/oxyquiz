const express = require("express");
const db = require("./db");
const cors = require("cors")

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
   console.log(`Server running on port ${port}.`);
});

app.get("/", (req, res) => {
   res.send("homepage");
});

app.get("/quizzes", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM quiz");
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
 });
 
 app.get("/quizzes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM quiz WHERE id = $1", [
            id
        ]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
 });
