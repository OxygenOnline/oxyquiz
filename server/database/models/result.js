'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    static associate({ Quiz, Option, OptionResult }) {
      this.belongsTo(Quiz, {
        foreignKey: { name: "quizId", allowNull: false },
        onDelete: "CASCADE"
      });
      this.belongsToMany(Option, {
        through: OptionResult,
        foreignKey: { name: "resultId"}
      });
    }
  }
  Result.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'results',
    timestamps: false
  });

  return Result;
};
