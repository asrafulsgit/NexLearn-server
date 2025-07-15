const express = require("express");
const studentAuthentication = require("../middlewares/studentAuth.middleware");
const { createReview, getReviewsBySession, deleteReview } = require("../controllers/review.controllers");
const reviewRouter = express.Router();


// -------------------- STUDENT ROUTERS --------------------

// Create a new review (Student)
reviewRouter.post("/:sessionId", studentAuthentication, createReview);

// Get all reviews for a specific session
reviewRouter.get("/session/:sessionId",studentAuthentication, getReviewsBySession);

// Get all reviews by the logged-in student
// router.get("/my-reviews", studentAuthentication, getMyReviews);

// Delete a review (Student)
reviewRouter.delete("/:reviewId", studentAuthentication, deleteReview);

module.exports = reviewRouter;
