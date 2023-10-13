'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    static associate({ Question, Result }) {
      this.belongsTo(Question, { foreignKey: { allowNull: false } }, { onDelete: "CASCADE" });
      this.belongsToMany(Result, { through: "option_result" });
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
    modelName: 'Option',
    timestamps: false,
    underscored: true
  });

  return Option;
};
