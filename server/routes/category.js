const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');

router.route('/')
    .get(controller.getAllCategories);

module.exports = router;
