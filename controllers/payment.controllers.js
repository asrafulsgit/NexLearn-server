const stripe = require('../config/stripe.config');
const Payment = require('../models/payment.model');
const BookedSession = require('../models/bookedSession.model');
const Session = require('../models/session.model');

// 1. Create PaymentIntent and return client_secret
const createPaymentSession = async (req, res) => {
  try {
    const studentId = req.student?.id;
    const { sessionId } = req.body;

    if (!studentId || !sessionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.fee === 0) {
      return res.status(400).json({ message: 'Session is free, no payment required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: session.fee * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true  
      },
      metadata: {
        sessionId,
        studentId,
      },
    });

    
    const isExistPayment = await Payment.findOne({ session: sessionId, student: studentId });
    if (!isExistPayment) {
      await Payment.create({
        student: studentId,
        session: sessionId,
        amount: session.fee,
        status: 'unpaid',
        stripePaymentIntentId: paymentIntent.id,
      });
    }

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// 2. Stripe webhook to update status after success
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

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const { sessionId, studentId } = intent.metadata;

    try {
      // Book the session
        const newBook = new BookedSession({
          student: studentId,
          session: sessionId,
          paymentStatus: 'paid',
        });

        await newBook.save();

      // Update payment status
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: 'paid' }
      );
      console.log(`✅ Session booked for student ${studentId}`);
    } catch (err) {
      console.error('Webhook booking error:', err);
      return res.status(500).send('Internal server error');
    }
  }

  res.json({ received: true });
};


module.exports = {
  createPaymentSession,
  handleStripeWebhook
};