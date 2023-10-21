const { ValidationError } = require('express-json-validator-middleware');

const logErrors = (err, req, res, next) => {
    // TODO: change to logger
    console.error(err);
    next(err);
};

const handleClientErrors = (err, req, res, next) => {
    // TODO
    if (err instanceof ValidationError) {
        res.status(400).send(err.validationErrors);
    }
    else {
        next(err);
    }
};

module.exports = {
    logErrors,
    handleClientErrors
};
