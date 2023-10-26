const express = require('express');
const router = express.Router();

const { Validator } = require('express-json-validator-middleware');
const quizSchema = require('../schemas/quiz.json');
const evaluationSchema = require('../schemas/evaluation.json');
const { validate } = new Validator();

const controller = require('../controllers/quiz');


router.route('/')
    .get(controller.getAllQuizzes)
    .post(validate({ body: quizSchema }), controller.createQuiz);

router.route('/random')
    .get(controller.getRandomQuiz);

router.route('/:id(\\d+)')
    .get(controller.getQuizById)
    .post(validate({ body: evaluationSchema }), controller.getResultEvaluation)
    .put(validate({ body: quizSchema }), controller.updateQuiz)
    .delete(controller.deleteQuiz);

router.route('/:categoryName')
    .get(controller.getAllQuizzesByCategory);

router.route('/:categoryName/random')
    .get(controller.getRandomQuizWithCategory);

router.param('id', controller.checkValidQuizId);

module.exports = router;
