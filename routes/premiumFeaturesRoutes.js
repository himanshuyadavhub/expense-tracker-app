const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const premiumFeatures = require("../controller/premiumFeaturesController");


router.get("/leaderboard", auth.authenticateUser, premiumFeatures.getLeaderboard);
router.get("/report", auth.authenticateUser, premiumFeatures.getReportOfExpenses);

module.exports = router;

