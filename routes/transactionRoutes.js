const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, transactionController.addTransaction);

router.get("/", authMiddleware, transactionController.getTransactions);

router.delete("/:transactionId", authMiddleware, transactionController.deleteTransaction);

module.exports = router;