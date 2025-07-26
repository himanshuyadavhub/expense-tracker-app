const express = require('express');
const router = express.Router();
const membershipController = require("../controller/membershipController");
const auth = require("../middleware/auth");

router.post("/buy", auth.authenticateUser, membershipController.makePaymentForPremium);
router.get("/status/:orderId", auth.authenticateUser, membershipController.updateStatusOfPremiumMembership);

module.exports = router;