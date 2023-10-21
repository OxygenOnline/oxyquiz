const express = require('express');
const cors = require('cors');
const { logErrors, handleClientErrors } = require('./utils/error');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const quizRouter = require('./routes/quiz');

app.use('/quizzes', quizRouter);

app.get('/', (req, res) => {
    // TODO
    res.send('homepage');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});

app.use(logErrors);
app.use(handleClientErrors);
