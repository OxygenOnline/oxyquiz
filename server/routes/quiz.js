const express = require('express');
const router = express.Router();
const { Validator } = require('express-json-validator-middleware');
const { validate } = new Validator();
const quizSchema = require('../validators/quiz.json');
const evaluationSchema = require('../validators/evaluation.json');
const userAuth = require('../utils/auth');
const controller = require('../controllers/quiz');
const logger = require('../utils/logger');


router.use((req, res, next) => {
    logger.http(`[${req.method}] ${req.originalUrl}`);
    next();
});

router.route('/')
    .get(controller.getAllQuizzes)
    .post(validate({ body: quizSchema }), userAuth, controller.createQuiz);

router.route('/random')
    .get(controller.getRandomQuiz);

router.route('/current')
    .get(userAuth, controller.getAllQuizzesByUser);

router.route('/:id(\\d+)')
    .get(controller.getQuizById)
    .post(validate({ body: evaluationSchema }), controller.getResultEvaluation)
    .put(validate({ body: quizSchema }), userAuth, controller.updateQuiz)
    .delete(userAuth, controller.deleteQuiz);
    
router.route('/:id(\\d+)/full')
    .get(userAuth, controller.getFullQuizById);
    
router.route('/:categoryName')
    .get(controller.getAllQuizzesByCategory);

router.route('/:categoryName/random')
    .get(controller.getRandomQuizWithCategory);

router.param('id', controller.checkValidQuizId);

module.exports = router;
