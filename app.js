const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user.route');
const bookEventRouter = require('./routes/bookEvent.route');
const eventRouter = require('./routes/event.route');
const myBookingRouter = require('./routes/myBooking.route');
const profileRouter = require('./routes/profile.router');
const reviewRouter = require('./routes/review.route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(cors({
     origin : process.env.FRONTEND_URL,
     credentials : true
}));


app.use('/api/v1',  userRouter);
app.use('/api/v1',  eventRouter);
app.use('/api/v1',  myBookingRouter);
app.use('/api/v1',  bookEventRouter);
app.use('/api/v1',  profileRouter);
app.use('/api/v1',  reviewRouter);




module.exports = app;
