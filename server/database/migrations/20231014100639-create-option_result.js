'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('option_results', {
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'options',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      result_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'results',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    });
  },
  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('option_results');
  }
};
