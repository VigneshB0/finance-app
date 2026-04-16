const router = require("express").Router();
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, reportController.getReport);

module.exports = router;