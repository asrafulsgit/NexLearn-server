const express = require("express");
const studentAuthentication = require("../middlewares/studentAuth.middleware");
const {createPaymentSession } = require("../controllers/payment.controllers");
const paymentRouter = express.Router();


// -------------------- STUDENT ROUTERS --------------------

paymentRouter.post('/student/:sessionId',studentAuthentication,createPaymentSession)


module.exports = paymentRouter;
