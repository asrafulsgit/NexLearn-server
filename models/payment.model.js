
 const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: {
    type :  mongoose.Schema.Types.ObjectId,
    ref  : 'User',
    required : [true, 'Student id  required']
},
  session: {
    type :  mongoose.Schema.Types.ObjectId,
    ref  : 'Session',
    required : [true, 'Session id  required']
},
  amount: {
    type : Number,
    required : [true, 'Amount is  required']
  },
  status: {
    type :  String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
}
},{timestamps : true, versionKey : false});

paymentSchema.index({student : 1, session : 1},{unique : true})


const Payment =  mongoose.model('Payment', paymentSchema);
module.exports = Payment;