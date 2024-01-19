const { check } = require('express-validator');
const { compare } = require('bcryptjs');
const createError = require('http-errors');
const userdb = require('../database/user');


const password = check('password')
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })
    .withMessage('Password must be at least 8 characters long, should contain uppercase, lowercase and number.');

const email = check('email')
    .isEmail()
    .withMessage('Please provide a valid email.');

const username = check('username')
    .isLength({ min: 4, max: 32 })
    .withMessage("Username length must be between 4 and and 32.")
    .custom((value) => {
        const usernameRegex = /^[a-z0-9\_\-]+$/i;

        if (!usernameRegex.test(value)) {
            throw Error(createError('Invalid username format.'));
        }

        return true;
    })
    .withMessage('Please provide a valid username.');

const emailExists = check('email').custom(async (email) => {
    const normalizedEmail = email.toLowerCase();
    const emailExists = await userdb.userExistsByEmail(normalizedEmail);

    if (emailExists) {
        throw Error(createError(409, `Email "${email}" already exists.`));
    }
});

const usernameExists = check('username').custom(async (username) => {
    const userNameExists = await userdb.userExistsByUsername(username);

    if (userNameExists) {
        throw Error(createError(409, `Username "${username}" already exists.`));
    }
});

const loginFieldsCheck = check('username').custom(async (username, { req }) => {

    const givenPassword = req.body.password;

    const userExists = await userdb.userExistsByUsername(username);

    if (!userExists) {
        throw Error(createError(404, `Invalid username "${username}".`));
    }

    const user = await userdb.getUserByUsernameWithPassword(username);

    const validPassword = await compare(givenPassword, user.password);
    if (!validPassword) {
        throw Error(createError(401, `Wrong password.`));
    }

    req.user = user;
});

module.exports = {
    registerValidation: [email, password, username, emailExists, usernameExists],
    loginValidation: [loginFieldsCheck],
};
