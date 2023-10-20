'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize) => {
  class OptionResult extends Model {
    static associate({ Option, Result }) {
    }
  }
  OptionResult.init({}, {
    sequelize,
    tableName: 'option_results',
    timestamps: false
  });

  return OptionResult;
};
