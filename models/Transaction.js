const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define("Transaction", {
  type: DataTypes.ENUM("income", "expense"),
  amount: DataTypes.FLOAT,
  category: DataTypes.STRING,
  date: DataTypes.DATE,
  description: DataTypes.STRING,
});

module.exports = Transaction;