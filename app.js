const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sessionRouter = require('./routes/session.router');
const userRouter = require('./routes/user.router');
const materialRouter = require('./routes/material.router');
const noteRouter = require('./routes/note.router');
const bookedSessionRouter = require('./routes/bookedSession.router');
const reviewRouter = require('./routes/review.router');
const tutorRouter = require('./routes/tutor.router');
const adminRouter = require('./routes/admin.router');
const paymentRouter = require('./routes/payment.router');


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(cors({
     origin : process.env.FRONTEND_URL,
     credentials : true
}));


app.use('/api/v1/user',  userRouter);
app.use('/api/v1/sessions',  sessionRouter); 
app.use('/api/v1/materials',  materialRouter); 
app.use('/api/v1/notes',  noteRouter); 
app.use('/api/v1/booked',  bookedSessionRouter); 
app.use('/api/v1/reviews',  reviewRouter); 
app.use('/api/v1/tutors',  tutorRouter); 
app.use('/api/v1/admin',  adminRouter); 
app.use('/api/v1/payment',  paymentRouter); 




module.exports = app;
