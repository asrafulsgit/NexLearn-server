const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'session title is required'] 
},
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'tutor is required']
  },

  description: { 
    type: String, 
    required: [true, 'session description is required']
},
  image: { 
    type: String, 
    required: [true, 'session image required'],
    trim : true
},
  registrationStart: { 
    type: Date, 
    required: [true, 'registration start date required'] 
},
  registrationEnd: { 
    type: Date, 
    required: [true, 'registration end date required'] 
},
  classStart: { 
    type: Date, 
    required: [true, 'class start date required'] 
},
  classEnd: { 
    type: Date, 
    required: [true,'class end date required'] 
},
  duration : {
    type : String,
    required : [true, 'session duration is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  fee: { 
    type: Number, 
    default: 0 
},
  rejectionReason: { type: String },
  feedback: { type: String }
}, { timestamps: true,versionKey : false });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;