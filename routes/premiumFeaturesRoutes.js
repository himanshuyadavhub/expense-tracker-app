const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const premiumFeatures = require("../controller/premiumFeaturesController");


router.get("/leaderboard", auth.authenticateUser, premiumFeatures.getLeaderboard);
router.get("/report", auth.authenticateUser, premiumFeatures.getReportOfExpenses);
router.get("/downloads", auth.authenticateUser, premiumFeatures.getPreviousDownloads);

module.exports = router;

