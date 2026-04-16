const router = require("express").Router();
const budgetController = require("../controllers/budgetController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, budgetController.setBudget);

router.get("/", authMiddleware, budgetController.getBudgets);

module.exports = router;