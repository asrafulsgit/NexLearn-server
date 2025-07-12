const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "Comment is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: [true, "Session is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

// a student can give one review in a session
reviewSchema.index({ student: 1, session: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
