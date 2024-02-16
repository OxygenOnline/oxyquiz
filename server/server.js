const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const { PORT, CLIENT_URL, SECRET, ENV } = require('./config/config');
const quizRouter = require('./routes/quiz');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const logger = require('./utils/logger');
const { logErrors, handleClientErrors } = require('./utils/error');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

var sessionSettings = {
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
};

if (ENV === 'production') {
    app.set('trust proxy', 1);
    sessionSettings.cookie.secure = true;
    sessionSettings.cookie.sameSite = 'None';
}

app.use(session(sessionSettings));

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport');

app.use('/api/quizzes', quizRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}.`);
});

app.use(logErrors);
app.use(handleClientErrors);
