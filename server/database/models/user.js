'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Quiz }) {
      this.hasMany(Quiz, {
        foreignKey: "creator_id"
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nickname: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    createdAt: "joining_date",
    updatedAt: false,
    underscored: true
  });

  return User;
};
