const router = require("express").Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, walletController.createWallet);

router.get("/", authMiddleware, walletController.getWallets);

router.delete("/:walletId", authMiddleware, walletController.deleteWallet);

module.exports = router;