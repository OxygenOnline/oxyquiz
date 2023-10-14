'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    static associate({ Category, User, Result, Question }) {
      this.belongsTo(User, {
        foreignKey: { name: "creator_id", allowNull: false },
        onDelete: "CASCADE"
      });
      this.belongsTo(Category, {
        foreignKey: { allowNull: false },
        onDelete: "RESTRICT"
      });
      this.hasMany(Result);
      this.hasMany(Question);
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
    modelName: 'Quiz',
    underscored: true
  });

  return Quiz;
};
