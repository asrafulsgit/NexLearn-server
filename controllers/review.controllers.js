const Review = require("../models/review.model");
const Session = require("../models/session.model");

// Create a new review
const createReview = async (req, res) => {
  try {
    const {sessionId}= req.params;
    const { rating, comment} = req.body;
    const studentId = req.student?.id;

    if (!rating || !comment || !sessionId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "Rating, comment, session and student are required.",
      });
    }

    const isExistRiview = await Review.findOne({session : sessionId, student : studentId})
    if (isExistRiview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this session.",
      });
    }

    const foundSession = await Session.findById(sessionId);
    if (!foundSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    const newReview = new Review({
      rating,
      comment,
      session : sessionId,
      student: studentId,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting the review.",
    });
  }
};

//  Get all reviews for a session
const getReviewsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const reviews = await Review.find({ session: sessionId })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews for this session.",
    });
  }
};


// ✅ Delete a review (student can delete their own)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.student?.id;

    if (!reviewId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "review and student ID are required.",
      });
    }
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    if (review.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review.",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the review.",
    });
  }
};

module.exports = {
  createReview,
  getReviewsBySession,
  deleteReview,
};
