const express = require("express");
const studentAuthentication = require("../middlewares/studentAuth.middleware");
const {createPaymentSession, handleStripeWebhook } = require("../controllers/payment.controllers");
const paymentRouter = express.Router();


// -------------------- STUDENT ROUTERS --------------------

paymentRouter.post('/student/:sessionId',studentAuthentication,createPaymentSession)
paymentRouter.post('/webhook',express.raw({ type: 'application/json' }),handleStripeWebhook)


module.exports = paymentRouter;
