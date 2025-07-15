const express = require('express');
const stripe = require('../config/stripe.config');
const Payment = require('../models/payment.model');
const BookedSession = require('../models/bookedSession.model');


// create stripe payment 
const createPaymentSession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const studentId = req.student?.id;
    const { amount } = req.body;
    if (!studentId || !sessionId || !amount) {
      return res.status(400).json({ 
        success : false,
        message: 'Missing required fields' 
    })
    };

    

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Session Payment',
            },
            unit_amount: Number(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success/${payment?._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        paymentId: payment._id.toString(),
      },
    });

    const payment = await Payment.create({
          student: studentId,
          session: sessionId,
          amount,
          status: 'paid'
        });
    return res.status(201).json({ 
        success : true,
        message : 'Payment created',
        url: session.url 
    });
  } catch (error) {
    console.error('createPaymentSession error:', error);
    return res.status(500).json({ 
        success : false,
        error: 'Payment initiation failed' 
    });
  }
};


// 2. Stripe Webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { paymentId, studentId, sessionId } = session.metadata;

    try {
      //  1. Mark payment as paid
      await Payment.findByIdAndUpdate(paymentId, { status: 'paid' });

      //  2. Automatically book the session
      const alreadyBooked = await BookedSession.findOne({ student: studentId, session: sessionId });
      if (!alreadyBooked) {
        await BookedSession.create({
          student: studentId,
          session: sessionId,
          status: 'paid',  
        });
      }

      console.log(`Session booked for student ${studentId}`);
    } catch (err) {
      console.error('Webhook booking error:', err);
      return res.status(500).send('Internal server error');
    }
  }

  res.json({ received: true });
};



const getUserPayments = async (req, res) => {
  try {
    const { studentId } = req.params;

    const payments = await Payment.find({ student: studentId }).populate('session');
    res.json(payments);
  } catch (error) {
    console.error('getUserPayments error:', error);
    res.status(500).json({ error: 'Failed to get user payments' });
  }
};
const getSessionPayments = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const payments = await Payment.find({ session: sessionId }).populate('student');
    res.json(payments);
  } catch (error) {
    console.error('getSessionPayments error:', error);
    res.status(500).json({ error: 'Failed to get session payments' });
  }
};
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    await Payment.findByIdAndDelete(id);
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    console.error('deletePayment error:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};


module.exports ={
    createPaymentSession,
    handleStripeWebhook
}
