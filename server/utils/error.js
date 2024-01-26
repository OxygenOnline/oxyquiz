const { ValidationError } = require('express-json-validator-middleware');
const { validationResult } = require('express-validator');
const logger = require('./logger');


const validationErrors = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    next();
};

const logErrors = (err, req, res, next) => {
    logger.error(err);
    next(err);
};

const handleClientErrors = (err, req, res, next) => {
    
    if (err instanceof ValidationError) {
        res.status(400).send(err.validationErrors);
    }
    else {
        next(err);
    }
};

module.exports = {
    validationErrors,
    logErrors,
    handleClientErrors
};
