require("dotenv").config();
const User = require("./models/User");
const Wallet = require("./models/Wallet");
const Transaction = require("./models/Transaction");
const Budget = require("./models/Budget");
const express = require("express");
const sequelize = require("./config/db");

User.hasMany(Wallet);
Wallet.belongsTo(User);

Wallet.hasMany(Transaction);
Transaction.belongsTo(Wallet);

User.hasMany(Budget);
Budget.belongsTo(User);


const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wallets", require("./routes/walletRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));

sequelize.sync().then(() => {
  app.listen(3000, () => console.log("Server running"));
});