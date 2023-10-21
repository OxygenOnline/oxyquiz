'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate({ Quiz, Option }) {
      this.belongsTo(Quiz, {
        foreignKey: { name: 'quizId', allowNull: false },
        onDelete: 'CASCADE'
      });
      this.hasMany(Option, {
        foreignKey: 'questionId'
      });
    }
  }
  Question.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    singleChoice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'questions',
    timestamps: false
  });

  return Question;
};
