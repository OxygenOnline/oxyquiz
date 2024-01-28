const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');
const logger = require('../utils/logger');


router.use((req, res, next) => {
    logger.http(`[${req.method}] ${req.originalUrl}`);
    next();
});

router.route('/')
    .get(controller.getAllCategories);

module.exports = router;
