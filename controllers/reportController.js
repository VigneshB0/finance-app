const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const { Op } = require("sequelize");

exports.getReport = async (req, res) => {
  try {
    const wallets = await Wallet.findAll({
      where: { UserId: req.user.id },
      attributes: ["id"],
    });

    const walletIds = wallets.map((wallet) => wallet.id);

    if (walletIds.length === 0) {
      return res.json({
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        categoryBreakdown: {},
        transactions: [],
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        WalletId: walletIds,
      },
      include: {
        model: Wallet,
        attributes: ["id", "name"],
      },
    });

    let income = 0;
    let expenses = 0;
    const categoryBreakdown = {};

    transactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
      
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        categoryBreakdown[t.category].income += t.amount;
      } else {
        categoryBreakdown[t.category].expenses += t.amount;
      }
    });

    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      netSavings: income - expenses,
      categoryBreakdown,
      transactions,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};