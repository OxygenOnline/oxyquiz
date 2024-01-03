const express = require('express');
const app = express();
const { PORT, CLIENT_URL, SECRET } = require('./config/config');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const { logErrors, handleClientErrors } = require('./utils/error');


require('./utils/passport')

app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(session({
    secret: SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session());

const quizRouter = require('./routes/quiz');
const userRouter = require('./routes/user');

app.use('/api/quizzes', quizRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

app.use(logErrors);
app.use(handleClientErrors);
