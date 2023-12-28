const { Router } = require('express');
const router = Router();

const { register, login, logout } = require('../controllers/user');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationErrors } = require('../utils/error');
const { Validator } = require('express-json-validator-middleware');
const registrationSchema = require('../validators/registration.json');
const { validate } = new Validator();

router.post('/register', validate({ body: registrationSchema }), registerValidation, validationErrors, register);
router.post('/login', loginValidation, validationErrors, login);
router.get('/logout', logout);

module.exports = router;
