const db = require('./models/index');
const { User, Category, Quiz, Question, Result, Option, OptionResult, sequelize } = db;


const checkValidPositions = (array) => {

  const positionsSet = new Set();
  array.filter(({ position }) => {

    if (position < 0 || position >= array.length || positionsSet.has(position)) {
      throw new Error(`Invalid or duplicate position found with value ${position}`);
    }
    positionsSet.add(position);
  });
};

const removableIds = (newArray, oldArray) => {

  const existingIds = oldArray.map(item => item.id);
  const newIds = newArray
    .filter(item => item && item.id !== undefined && item.id !== null)
    .map(item => item.id);
  const ids = existingIds.filter(id => !newIds.includes(id));
  return ids;
};

const getQuizzes = async (limit = 20, offset = 0, categoryPathName = null, userId = null) => {

  const queryOptions = {
    offset,
    limit,
    attributes: ['id', 'title', 'description', 'createdAt'],
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: User,
        attributes: ['id', 'username'],
        as: 'creator',
      },
    ],
    order: [
      ['createdAt', 'DESC']
    ]
  };

  if (categoryPathName) {

    const category = await Category.findOne({
      where: { pathName: categoryPathName },
      attributes: ['id'],
    });
    queryOptions.where = { categoryId: category.id };
  }

  if (userId) {
    queryOptions.where = { creatorId: userId };
  }

  const quizzes = await Quiz.findAll(queryOptions);
  return quizzes;
};

const getAllQuizzes = async (limit = 20, offset = 0) => {

  const result = await getQuizzes(limit, offset);
  return result;
};

const getNumberOfQuizzes = async () => {

  const count = await Quiz.count();
  return count;
};

const getAllQuizzesByCategory = async (categoryPathName, limit = 20, offset = 0) => {

  const result = await getQuizzes(limit, offset, categoryPathName);
  return result;
};

const getNumberOfQuizzesByCategory = async (categoryPathName) => {

  const category = await Category.findOne({
    where: { pathName: categoryPathName },
    attributes: ['id'],
  });

  const count = await Quiz.count({
    where: {
      categoryId: category.id,
    },
  });
  return count;
};

const getAllQuizzesByUser = async (userId, limit = 20, offset = 0) => {

  const result = await getQuizzes(limit, offset, null, userId);
  return result;
};

const getNumberOfQuizzesByUser = async (userId) => {

  const count = await Quiz.count({
    where: {
      creatorId: userId,
    },
  });
  return count;
};

const getFullQuizById = async (quizId) => {

  let quizData = await Quiz.findByPk(quizId, {
    include: [
      {
        model: Result,
        attributes: { exclude: ['quizId'] },
        as: 'results'
      },
      {
        model: Question,
        attributes: { exclude: ['quizId'] },
        as: 'questions',
        include: {
          model: Option,
          as: 'options',
          include: {
            model: Result,
            attributes: ['position'],
            through: { attributes: [] },
          }
        }
      },
    ],
  });

  const quiz = {
    ...quizData.toJSON(),
    questions: quizData.questions.map((question) => ({
      ...question.toJSON(),
      options: question.options.map((option) => ({
        ...option.toJSON(),
        selectedResults: option.Results.map((result) => result.position),
        Results: undefined
      })),
    })),
  };

  return quiz;
};

const getQuizById = async (quizId) => {

  const quiz = await Quiz.findByPk(quizId, {
    attributes: { exclude: ['categoryId', 'creatorId', 'deletedAt'] },
    include: [
      {
        model: Category,
        as: 'category'
      },
      {
        model: User,
        attributes: { exclude: ['password', 'email', 'deletedAt'] },
        as: 'creator'
      },
      {
        model: Result,
        attributes: { exclude: ['quizId'] },
        as: 'results'
      },
      {
        model: Question,
        attributes: { exclude: ['quizId', 'weight'] },
        as: 'questions',
        include: {
          model: Option,
          attributes: { exclude: ['questionId'] },
          as: 'options'
        }
      },
    ],
  });

  return quiz;
};

const getRandomQuiz = async (categoryPathName) => {

  const queryOptions = {
    order: sequelize.random(),
  };

  if (categoryPathName) {
    const category = await Category.findOne({
      where: { pathName: categoryPathName },
      attributes: ['id']
    });
    queryOptions.where = { categoryId: category.id };
  }

  const quizId = await Quiz.findOne(queryOptions);

  return quizId;
};

const createQuiz = async (quizData, creatorId) => {

  const t = await sequelize.transaction();

  try {

    const quiz = await Quiz.create({
      title: quizData.title,
      description: quizData.description,
      creatorId,
      categoryId: quizData.categoryId
    });

    const results = quizData.results;
    checkValidPositions(results);
    let resultIdArray = [];
    for (const result of results) {

      const newResult = await Result.create({
        title: result.title,
        description: result.description,
        position: result.position,
        quizId: quiz.id
      });
      resultIdArray.splice(result.position, 0, newResult.id);
    }

    const questions = quizData.questions;
    checkValidPositions(questions);
    for (const question of questions) {

      const newQuestion = await Question.create({
        content: question.content,
        position: question.position,
        weight: question.weight,
        singleChoice: question.singleChoice,
        quizId: quiz.id
      });

      checkValidPositions(question.options);
      for (const option of question.options) {

        const newOption = await Option.create({
          content: option.content,
          position: option.position,
          questionId: newQuestion.id
        });

        for (const resultPosition of option.resultPositions) {

          await db.OptionResult.create({
            optionId: newOption.id,
            resultId: resultIdArray[resultPosition]
          });
        }
      }
    }

    await t.commit();
    return quiz.id;
  }
  catch (error) {

    await t.rollback();
    throw error;
  }
};

const updateQuizById = async (quizId, quizData) => {

  const t = await sequelize.transaction();

  try {

    await Quiz.update({
      title: quizData.title,
      description: quizData.description,
      categoryId: quizData.categoryId
    }, {
      where: {
        id: quizId
      }
    });

    const results = quizData.results;
    checkValidPositions(results);

    let dbRows = await Result.findAll({
      where: {
        quizId
      },
      attributes: ['id']
    });
    let toBeDeleted = removableIds(results, dbRows);
    for (const deletableId of toBeDeleted) {

      await Result.destroy({
        where: {
          id: deletableId,
          quizId
        }
      });
    }

    let resultIdArray = [];
    for (const result of results) {

      if (result.id === undefined) {

        const newResult = await Result.create({
          title: result.title,
          description: result.description,
          position: result.position,
          quizId
        });
        result.id = newResult.id;
      }
      else {

        await Result.update({
          title: result.title,
          description: result.description,
          position: result.position,
        }, {
          where: {
            id: result.id,
            quizId
          }
        });
        resultIdArray.splice(result.position, 0, result.id);
      }

    }

    const questions = quizData.questions;
    checkValidPositions(questions);

    dbRows = await Question.findAll({
      where: {
        quizId
      }
    });
    toBeDeleted = removableIds(questions, dbRows);
    for (const deletableId of toBeDeleted) {

      await Question.destroy({
        where: {
          id: deletableId,
          quizId
        }
      });
    }

    for (const question of questions) {

      if (question.id === undefined) {

        const newQuestion = await Question.create({
          content: question.content,
          position: question.position,
          weight: question.weight,
          singleChoice: question.singleChoice,
          quizId
        });
        question.id = newQuestion.id;
      }
      else {

        await Question.update({
          content: question.content,
          position: question.position,
          weight: question.weight,
          singleChoice: question.singleChoice
        }, {
          where: {
            id: question.id,
            quizId
          }
        });
      }

      const options = question.options;
      checkValidPositions(options);
      dbRows = await Option.findAll({
        where: {
          questionId: question.id
        }
      });
      toBeDeleted = removableIds(options, dbRows);
      for (const deletableId of toBeDeleted) {

        await Option.destroy({
          where: {
            id: deletableId,
            questionId: question.id
          }
        });
      }

      for (const option of options) {

        if (option.id === undefined) {

          const newOption = await Option.create({
            content: option.content,
            position: option.position,
            questionId: question.id
          });
          option.id = newOption.id;
        }
        else {

          await Option.update({
            content: option.content,
            position: option.position,
          }, {
            where: {
              id: option.id,
              questionId: question.id
            }
          });
        }

        dbRows = await OptionResult.findAll({
          where: {
            optionId: option.id
          },
          attributes: ['resultId']
        });
        dbRows = dbRows.map(item => item.resultId);
        const optionResults = option.resultPositions
          .map(index => resultIdArray[index])
          .filter(resultId => resultId !== undefined && resultId !== null);

        for (const oldId of dbRows) {

          if (!optionResults.includes(oldId)) {
            await OptionResult.destroy({
              where: {
                optionId: option.id,
                resultId: oldId
              }
            });
          }
        }

        for (const newId of optionResults) {

          if (!dbRows.includes(newId)) {
            await OptionResult.create({
              optionId: option.id,
              resultId: newId
            });
          }
        }
      }
    }

    await t.commit();
    return getQuizById(quizId);
  }
  catch (error) {

    await t.rollback();
    throw error;
  }
};

const deleteQuizById = async (quizId) => {

  const t = await sequelize.transaction();

  try {

    await Quiz.destroy({
      where: {
        id: quizId
      }
    });
    await t.commit();
  }
  catch (error) {

    await t.rollback();
    throw error;
  }
};

const quizExists = async (quizId) => {

  const count = await Quiz.count({
    where: {
      id: quizId,
    },
  });
  return count != 0;
};

const categoryExists = async (categoryPathName) => {

  const count = await Category.count({
    where: {
      pathName: categoryPathName,
    },
  });
  return count != 0;
};

const checkCreator = async (quizId, userId) => {

  const quiz = await Quiz.findByPk(quizId, {
    attributes: ['creatorId'],
  });

  if (quiz && quiz.creatorId === userId) {
    return true;
  }

  return false;
};

const evaluateResult = async (quizId, answers) => {

  try {

    const results = await Result.findAll({
      where: {
        quizId
      },
      attributes: { exclude: ['quizId'] }
    });

    const questions = await Question.findAll({
      where: {
        quizId
      },
      attributes: ['id']
    });
    let questionIds = questions.map(item => item.id);
    const resultScores = Array(results.length).fill(0);

    for (const answer of answers) {

      const { questionId, optionIds } = answer;

      if (!questionIds.includes(questionId)) {
        throw new Error('Invalid question in result evaluation');
      }
      questionIds = questionIds.filter(item => item !== questionId);

      const question = await Question.findByPk(questionId);

      if (question.quizId !== quizId) {
        throw new Error('Invalid question in result evaluation');
      }

      if (question.singleChoice && optionIds.length > 1) {
        throw new Error('Invalid option in result evaluation');
      }

      for (const optionId of optionIds) {

        const option = await Option.findByPk(optionId);

        if (option.questionId !== questionId) {
          throw new Error('Invalid option in result evaluation');
        }

        const optionResults = await OptionResult.findAll({
          where: {
            optionId
          },
          attributes: ['resultId']
        });
        const resultIds = optionResults.map(item => item.resultId);

        for (const resultId of resultIds) {

          const result = await Result.findByPk(resultId);
          resultScores[result.position] += question.weight;
        }
      }
    }

    if (questionIds.length !== 0) {
      throw new Error('All questions need to be filled for result evaluation');
    }

    const max = Math.max(...resultScores);
    const resultIndex = resultScores.indexOf(max);
    const winningResult = results[resultIndex];

    return winningResult;
  }
  catch (error) {

    const evaluationError = new Error(`Error in evaluating ${quizId} result: ${error.message}`);
    throw evaluationError;
  }
};

module.exports = {
  getAllQuizzes,
  getNumberOfQuizzes,
  getAllQuizzesByCategory,
  getNumberOfQuizzesByCategory,
  getAllQuizzesByUser,
  getNumberOfQuizzesByUser,
  getFullQuizById,
  getQuizById,
  getRandomQuiz,
  createQuiz,
  updateQuizById,
  deleteQuizById,
  quizExists,
  categoryExists,
  checkCreator,
  evaluateResult
};
