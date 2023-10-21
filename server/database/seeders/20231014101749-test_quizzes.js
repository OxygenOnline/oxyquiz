'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('quizzes', [{
      id: 1001,
      title: "Are you a cat or a dog?",
      categoryId: 6,
      creatorId: 1001,
      createdAt: Sequelize.fn("NOW"),
      updatedAt: Sequelize.fn("NOW")
    },
    {
      id: 1002,
      title: "Which Harry Potter house suits you?",
      categoryId: 3,
      creatorId: 1003,
      createdAt: Sequelize.fn("NOW"),
      updatedAt: Sequelize.fn("NOW")
    },
    {
      id: 1003,
      title: "Would you survive a zombie apocalypse?",
      categoryId: 9,
      creatorId: 1003,
      createdAt: Sequelize.fn("NOW"),
      updatedAt: Sequelize.fn("NOW")
    }
    ], {});

    await queryInterface.bulkInsert('questions', [{
      id: 1001,
      quizId: 1001,
      content: "Are you a morning person or a night owl?",
      position: 1
    },
    {
      id: 1002,
      quizId: 1001,
      content: "Favorite color?",
      position: 2
    },
    {
      id: 1003,
      quizId: 1001,
      content: "Favorite subject?",
      position: 0
    },
    {
      id: 1004,
      quizId: 1002,
      content: "Do you prefer the seaside, forest or the mountains?",
      position: 1
    },
    {
      id: 1005,
      quizId: 1002,
      content: "Favorite pet?",
      position: 0
    },
    {
      id: 1006,
      quizId: 1003,
      content: "Were you good at PE?",
      position: 0
    },
    {
      id: 1007,
      quizId: 1003,
      content: "Do you think you would survive?",
      position: 1
    }
    ], {});

    await queryInterface.bulkInsert('results', [{
      id: 1001,
      quizId: 1001,
      title: "Cat",
      position: 0
    },
    {
      id: 1002,
      quizId: 1001,
      title: "Dog",
      position: 1
    },
    {
      id: 1003,
      quizId: 1002,
      title: "Ravenclaw",
      position: 0
    },
    {
      id: 1004,
      quizId: 1002,
      title: "Hufflepuff",
      position: 1
    },
    {
      id: 1005,
      quizId: 1002,
      title: "Gryffindor",
      position: 2
    },
    {
      id: 1006,
      quizId: 1002,
      title: "Slytherin",
      position: 3
    },
    {
      id: 1007,
      quizId: 1003,
      title: "Yes, you would survive",
      position: 0
    },
    {
      id: 1008,
      quizId: 1003,
      title: "No, you would die",
      position: 1
    }
    ], {});

    await queryInterface.bulkInsert('options', [{
      id: 1001,
      questionId: 1001,
      content: "Morning person",
      position: 0
    },
    {
      id: 1002,
      questionId: 1001,
      content: "Night owl",
      position: 1
    },
    {
      id: 1003,
      questionId: 1002,
      content: "Red",
      position: 1
    },
    {
      id: 1004,
      questionId: 1002,
      content: "Blue",
      position: 2
    },
    {
      id: 1005,
      questionId: 1002,
      content: "Yellow",
      position: 0
    },
    {
      id: 1006,
      questionId: 1003,
      content: "Math",
      position: 1
    },
    {
      id: 1007,
      questionId: 1003,
      content: "Literature",
      position: 2
    },
    {
      id: 1008,
      questionId: 1003,
      content: "P.E.",
      position: 3
    },
    {
      id: 1009,
      questionId: 1003,
      content: "Arts",
      position: 0
    },
    {
      id: 1010,
      questionId: 1004,
      content: "Seaside",
      position: 1
    },
    {
      id: 1011,
      questionId: 1004,
      content: "Forest",
      position: 2
    },
    {
      id: 1012,
      questionId: 1004,
      content: "Mountain",
      position: 0
    },
    {
      id: 1013,
      questionId: 1005,
      content: "Dog",
      position: 1
    },
    {
      id: 1014,
      questionId: 1005,
      content: "Cat",
      position: 2
    },
    {
      id: 1015,
      questionId: 1005,
      content: "Something exotic",
      position: 0
    },
    {
      id: 1016,
      questionId: 1006,
      content: "Yes",
      position: 1
    },
    {
      id: 1017,
      questionId: 1006,
      content: "No",
      position: 0
    },
    {
      id: 1018,
      questionId: 1007,
      content: "Yes",
      position: 1
    },
    {
      id: 1019,
      questionId: 1007,
      content: "No",
      position: 0
    }
    ], {});

    await queryInterface.bulkInsert('option_results', [{
      optionId: 1001,
      resultId: 1002
    },
    {
      optionId: 1002,
      resultId: 1001
    },
    {
      optionId: 1003,
      resultId: 1001
    },
    {
      optionId: 1003,
      resultId: 1002
    },
    {
      optionId: 1004,
      resultId: 1002
    },
    {
      optionId: 1005,
      resultId: 1001
    },
    {
      optionId: 1006,
      resultId: 1001
    },
    {
      optionId: 1007,
      resultId: 1002
    },
    {
      optionId: 1008,
      resultId: 1002
    },
    {
      optionId: 1009,
      resultId: 1001
    },
    {
      optionId: 1010,
      resultId: 1006
    },
    {
      optionId: 1011,
      resultId: 1005
    },
    {
      optionId: 1011,
      resultId: 1004
    },
    {
      optionId: 1012,
      resultId: 1003
    },
    {
      optionId: 1013,
      resultId: 1005
    },
    {
      optionId: 1013,
      resultId: 1004
    },
    {
      optionId: 1014,
      resultId: 1006
    },
    {
      optionId: 1015,
      resultId: 1003
    },
    {
      optionId: 1016,
      resultId: 1007
    },
    {
      optionId: 1017,
      resultId: 1008
    },
    {
      optionId: 1018,
      resultId: 1007
    },
    {
      optionId: 1019,
      resultId: 1008
    }

    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('option_results', null, {});
    await queryInterface.bulkDelete('options', null, {});
    await queryInterface.bulkDelete('results', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('quizzes', null, {});
  }
};
