const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const Budget = require("../models/Budget");
const { Op } = require("sequelize");

exports.addTransaction = async (req, res) => {
  try {
    const { walletId, type, amount, category, date } = req.body;

    if (!walletId || !type || amount === undefined || !category || !date) {
      return res.status(400).json({
        msg: "walletId, type, amount, category, and date are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        msg: "type must be either income or expense",
      });
    }

    if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        msg: "amount must be a positive number",
      });
    }

    const wallet = await Wallet.findOne({
      where: { id: walletId, UserId: req.user.id },
    });

    if (!wallet)
      return res.status(404).json({ msg: "Wallet not found" });

    const transaction = await Transaction.create({
      ...req.body,
      WalletId: walletId,
    });

    // Update wallet balance
    if (type === "income") wallet.balance += amount;
    else wallet.balance -= amount;

    await wallet.save();

    // 🔔 Budget Check
    if (type === "expense") {
      const month = new Date(date).toISOString().slice(0, 7);

      const budget = await Budget.findOne({
        where: {
          UserId: req.user.id,
          category,
          month,
        },
      });

      if (budget) {
        const totalExpenses = await Transaction.sum("amount", {
          where: {
            category,
            type: "expense",
            WalletId: walletId,
            date: {
              [Op.between]: [
                new Date(`${month}-01`),
                new Date(`${month}-31`),
              ],
            },
          },
        });

        if (totalExpenses >= budget.amount) {
          return res.json({
            transaction,
            warning: "⚠️ Budget exceeded!",
          });
        } else if (totalExpenses >= budget.amount * 0.8) {
          return res.json({
            transaction,
            warning: "⚠️ Approaching budget limit",
          });
        }
      }
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const wallets = await Wallet.findAll({
      where: { UserId: req.user.id },
      attributes: ["id"],
    });

    const walletIds = wallets.map((wallet) => wallet.id);

    if (walletIds.length === 0) {
      return res.json([]);
    }

    const transactions = await Transaction.findAll({
      where: {
        WalletId: {
          [Op.in]: walletIds,
        },
      },
      include: {
        model: Wallet,
        attributes: ["id", "name", "balance"],
      },
      order: [["date", "DESC"], ["createdAt", "DESC"]],
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(
      req.params.transactionId
    );

    if (!transaction)
      return res.status(404).json({ msg: "Transaction not found" });

    const wallet = await Wallet.findOne({
      where: {
        id: transaction.WalletId,
        UserId: req.user.id,
      },
    });

    if (!wallet)
      return res.status(403).json({ msg: "Unauthorized" });

    // Reverse balance
    if (transaction.type === "income")
      wallet.balance -= transaction.amount;
    else wallet.balance += transaction.amount;

    await wallet.save();

    await transaction.destroy();

    res.json({ msg: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};