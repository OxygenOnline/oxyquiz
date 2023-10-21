'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate({ Quiz }) {
      this.hasMany(Quiz, {
        foreignKey: 'categoryId'
      });
    }
  }
  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'categories',
    timestamps: false
  });

  return Category;
};
