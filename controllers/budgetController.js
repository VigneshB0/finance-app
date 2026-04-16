const Budget = require("../models/Budget");

exports.setBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;
    const month = new Date().toISOString().slice(0, 7);

    const [budget, created] = await Budget.upsert({
      UserId: req.user.id,
      category,
      amount,
      month,
    });

    res.json({ msg: "Budget set successfully", budget });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7);

    const budgets = await Budget.findAll({
      where: { UserId: req.user.id, month },
    });

    res.json(budgets);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};