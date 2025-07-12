const express = require("express");
const studentAuthentication = require("../middlewares/studentAuth.middleware");
const { bookSession, getMyBookedSessions, cancelBooking, getAllBookings, getBookedStudentsBySession } = require("../controllers/bookedSession.controllers");
const adminAuthentication = require("../middlewares/adminAuth.middleware");
const bookedSessionRouter = express.Router();




// -------------------- STUDENT ROUTES --------------------

//  Book a session (student)
bookedSessionRouter.post("/book", studentAuthentication, bookSession);

//  Get logged-in student's bookings
bookedSessionRouter.get("/my-bookings", studentAuthentication, getMyBookedSessions);

//  Cancel a booking (student)
bookedSessionRouter.delete("/cancel/:bookingId", studentAuthentication, cancelBooking);

// -------------------- ADMIN ROUTES --------------------

//  Get all bookings (admin only)
bookedSessionRouter.get("/admin/all", adminAuthentication, getAllBookings);

//  Get all students booked in a session (tutor/admin)
bookedSessionRouter.get("/session/:sessionId/students", adminAuthentication, getBookedStudentsBySession);

module.exports = bookedSessionRouter;
