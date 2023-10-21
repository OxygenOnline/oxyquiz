'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    static associate({ Question, Result, OptionResult }) {
      this.belongsTo(Question, {
        foreignKey: { name: 'questionId', allowNull: false },
        onDelete: 'CASCADE'
      });
      this.belongsToMany(Result, {
        through: OptionResult,
        foreignKey: { name: 'optionId'}
      });
    }
  }
  Option.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'options',
    timestamps: false
  });

  return Option;
};
