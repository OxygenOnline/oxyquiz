'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('quizzes', [{
      id: 1001,
      title: "Are you a cat or a dog?",
      category_id: 6,
      creator_id: 1001,
      created_at: Sequelize.fn("NOW"),
      updated_at: Sequelize.fn("NOW")
    },
    {
      id: 1002,
      title: "Which Harry Potter house suits you?",
      category_id: 3,
      creator_id: 1003,
      created_at: Sequelize.fn("NOW"),
      updated_at: Sequelize.fn("NOW")
    },
    {
      id: 1003,
      title: "Would you survive a zombie apocalypse?",
      category_id: 9,
      creator_id: 1003,
      created_at: Sequelize.fn("NOW"),
      updated_at: Sequelize.fn("NOW")
    }
    ], {});

    await queryInterface.bulkInsert('questions', [{
      id: 1001,
      quiz_id: 1001,
      content: "Are you a morning person or a night owl?",
      position: 1
    },
    {
      id: 1002,
      quiz_id: 1001,
      content: "Favorite color?",
      position: 2
    },
    {
      id: 1003,
      quiz_id: 1001,
      content: "Favorite subject?",
      position: 0
    },
    {
      id: 1004,
      quiz_id: 1002,
      content: "Do you prefer the seaside, forest or the mountains?",
      position: 1
    },
    {
      id: 1005,
      quiz_id: 1002,
      content: "Favorite pet?",
      position: 0
    },
    {
      id: 1006,
      quiz_id: 1003,
      content: "Were you good at PE?",
      position: 0
    },
    {
      id: 1007,
      quiz_id: 1003,
      content: "Do you think you would survive?",
      position: 1
    }
    ], {});

    await queryInterface.bulkInsert('results', [{
      id: 1001,
      quiz_id: 1001,
      title: "Cat",
      position: 0
    },
    {
      id: 1002,
      quiz_id: 1001,
      title: "Dog",
      position: 1
    },
    {
      id: 1003,
      quiz_id: 1002,
      title: "Ravenclaw",
      position: 0
    },
    {
      id: 1004,
      quiz_id: 1002,
      title: "Hufflepuff",
      position: 1
    },
    {
      id: 1005,
      quiz_id: 1002,
      title: "Gryffindor",
      position: 2
    },
    {
      id: 1006,
      quiz_id: 1002,
      title: "Slytherin",
      position: 3
    },
    {
      id: 1007,
      quiz_id: 1003,
      title: "Yes, you would survive",
      position: 0
    },
    {
      id: 1008,
      quiz_id: 1003,
      title: "No, you would die",
      position: 1
    }
    ], {});

    await queryInterface.bulkInsert('options', [{
      id: 1001,
      question_id: 1001,
      content: "Morning person",
      position: 0
    },
    {
      id: 1002,
      question_id: 1001,
      content: "Night owl",
      position: 1
    },
    {
      id: 1003,
      question_id: 1002,
      content: "Red",
      position: 1
    },
    {
      id: 1004,
      question_id: 1002,
      content: "Blue",
      position: 2
    },
    {
      id: 1005,
      question_id: 1002,
      content: "Yellow",
      position: 0
    },
    {
      id: 1006,
      question_id: 1003,
      content: "Math",
      position: 1
    },
    {
      id: 1007,
      question_id: 1003,
      content: "Literature",
      position: 2
    },
    {
      id: 1008,
      question_id: 1003,
      content: "P.E.",
      position: 3
    },
    {
      id: 1009,
      question_id: 1003,
      content: "Arts",
      position: 0
    },
    {
      id: 1010,
      question_id: 1004,
      content: "Seaside",
      position: 1
    },
    {
      id: 1011,
      question_id: 1004,
      content: "Forest",
      position: 2
    },
    {
      id: 1012,
      question_id: 1004,
      content: "Mountain",
      position: 0
    },
    {
      id: 1013,
      question_id: 1005,
      content: "Dog",
      position: 1
    },
    {
      id: 1014,
      question_id: 1005,
      content: "Cat",
      position: 2
    },
    {
      id: 1015,
      question_id: 1005,
      content: "Something exotic",
      position: 0
    },
    {
      id: 1016,
      question_id: 1006,
      content: "Yes",
      position: 1
    },
    {
      id: 1017,
      question_id: 1006,
      content: "No",
      position: 0
    },
    {
      id: 1018,
      question_id: 1007,
      content: "Yes",
      position: 1
    },
    {
      id: 1019,
      question_id: 1007,
      content: "No",
      position: 0
    }
    ], {});

    await queryInterface.bulkInsert('option_results', [{
      option_id: 1001,
      result_id: 1002
    },
    {
      option_id: 1002,
      result_id: 1001
    },
    {
      option_id: 1003,
      result_id: 1001
    },
    {
      option_id: 1003,
      result_id: 1002
    },
    {
      option_id: 1004,
      result_id: 1002
    },
    {
      option_id: 1005,
      result_id: 1001
    },
    {
      option_id: 1006,
      result_id: 1001
    },
    {
      option_id: 1007,
      result_id: 1002
    },
    {
      option_id: 1008,
      result_id: 1002
    },
    {
      option_id: 1009,
      result_id: 1001
    },
    {
      option_id: 1010,
      result_id: 1006
    },
    {
      option_id: 1011,
      result_id: 1005
    },
    {
      option_id: 1011,
      result_id: 1004
    },
    {
      option_id: 1012,
      result_id: 1003
    },
    {
      option_id: 1013,
      result_id: 1005
    },
    {
      option_id: 1013,
      result_id: 1004
    },
    {
      option_id: 1014,
      result_id: 1006
    },
    {
      option_id: 1015,
      result_id: 1003
    },
    {
      option_id: 1016,
      result_id: 1007
    },
    {
      option_id: 1017,
      result_id: 1008
    },
    {
      option_id: 1018,
      result_id: 1007
    },
    {
      option_id: 1019,
      result_id: 1008
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
