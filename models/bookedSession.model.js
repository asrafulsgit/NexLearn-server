const mongoose = require('mongoose');

const bookedSessionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: [true, 'Session reference is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// for duplicate booking
bookedSessionSchema.index({ session: 1, student: 1 }, { unique: true });

const BookedSession = mongoose.model('BookedSession', bookedSessionSchema);
module.exports = BookedSession;
