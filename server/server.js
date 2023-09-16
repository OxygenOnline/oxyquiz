const express = require("express");
const db = require("./db/index");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const quizRouter = require("./routes/quizzes");

app.use("/quizzes", quizRouter);

app.get("/", (req, res) => {
    // TODO
    res.send("homepage");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
