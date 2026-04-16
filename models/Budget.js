const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Budget = sequelize.define("Budget", {
  category: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  month: DataTypes.STRING,
});

module.exports = Budget;