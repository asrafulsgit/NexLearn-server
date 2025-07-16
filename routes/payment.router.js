const express = require("express");
const studentAuthentication = require("../middlewares/studentAuth.middleware");
const {createPaymentSession, handleStripeWebhook } = require("../controllers/payment.controllers");
const paymentRouter = express.Router();


// -------------------- STUDENT ROUTERS --------------------

paymentRouter.post('/intent',studentAuthentication,createPaymentSession)
paymentRouter.post('/webhook', handleStripeWebhook);


module.exports = paymentRouter;
