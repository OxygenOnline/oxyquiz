'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate({ Category, User, Result, Question }) {
      this.belongsTo(User, {
        as: 'creator',
        foreignKey: { name: 'creatorId', allowNull: false },
        onDelete: 'CASCADE'
      });
      this.belongsTo(Category, {
        as: 'category',
        foreignKey: { name: 'categoryId', allowNull: false },
        onDelete: 'RESTRICT'
      });
      this.hasMany(Result, {
        as: 'results',
        foreignKey: 'quizId'
      });
      this.hasMany(Question, {
        as: 'questions',
        foreignKey: 'quizId'
      });
    }
  }
  Quiz.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    paranoid: true,
    tableName: 'quizzes'
  });

  return Quiz;
};
