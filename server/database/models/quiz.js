'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate({ Category, User, Result, Question }) {
      this.belongsTo(User, {
        foreignKey: { name: 'creatorId', allowNull: false },
        onDelete: 'CASCADE'
      });
      this.belongsTo(Category, {
        foreignKey: { name: 'categoryId', allowNull: false },
        onDelete: 'RESTRICT'
      });
      this.hasMany(Result, {
        foreignKey: 'quizId'
      });
      this.hasMany(Question, {
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
    tableName: 'quizzes'
  });

  return Quiz;
};
