const express = require('express');
const router = express.Router();
const premiumController = require("../controller/premiumController");
const auth = require("../middleware/auth");

router.post("/buy", auth.authenticateUser, premiumController.makePaymentForPremium);
router.get("/status/:orderId", auth.authenticateUser, premiumController.updateStatusOfPremiumMembership);

module.exports = router;