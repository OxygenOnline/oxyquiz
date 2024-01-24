const { ValidationError } = require('express-json-validator-middleware');
const { validationResult } = require('express-validator');
const winston = require('winston');


const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log' })
    ],
});

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
        res.status(err.status).send(err.validationErrors);
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
