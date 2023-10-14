'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    static associate({ Quiz, Option }) {
      this.belongsTo(Quiz, {
        foreignKey: { allowNull: false },
        onDelete: "CASCADE"
      });
      this.belongsToMany(Option, {
        through: "option_results",
        timestamps: false
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
    modelName: 'Result',
    timestamps: false,
    underscored: true
  });

  return Result;
};
