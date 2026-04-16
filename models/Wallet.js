const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Wallet = sequelize.define("Wallet", {
  name: DataTypes.STRING,
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = Wallet;