const { Router } = require('express');
const router = Router();

const { register, login, logout, getUser, checkAuth } = require('../controllers/user');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationErrors } = require('../utils/error');
const { Validator } = require('express-json-validator-middleware');
const registrationSchema = require('../validators/registration.json');
const { validate } = new Validator();
const userAuth = require('../utils/auth');
const logger = require('../utils/logger');


router.use((req, res, next) => {
    logger.http(`[${req.method}] ${req.originalUrl}`);
    next();
});

router.post('/register', validate({ body: registrationSchema }), registerValidation, validationErrors, register);
router.post('/login', loginValidation, validationErrors, login);
router.get('/logout', userAuth, logout);
router.get('/profile-data', userAuth, getUser);
router.get('/check-auth', userAuth, checkAuth);

module.exports = router;
