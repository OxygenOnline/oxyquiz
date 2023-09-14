const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

app.listen(port, () => {
   console.log(`Server running on port ${port}.`);
});

app.get("/", (req, res) => {
   res.send("homepage");
});

app.get("/quizzes", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM quiz');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
 });
 
 
