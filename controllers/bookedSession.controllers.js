const BookedSession = require('../models/bookedSession.model');
const Session = require('../models/session.model');
const User = require('../models/user.model');

// 1. Book a Session (Student)
const bookSession = async (req, res) => {
  try {
    const studentId = req.student?.id;  
    const { sessionId } = req.params;

    if (!sessionId || !studentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Session and Student ID are required" 
    });
    }

    const session = await Session.findById(sessionId);
    if (!session || session.status !== 'approved') {
      return res.status(404).json({ 
        success: false, 
        message: "Session not found or not approved" 
    });
    }

    const alreadyBooked = await BookedSession.findOne({ 
        session: sessionId, student: studentId 
    });
    if (alreadyBooked) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already booked this session" 
    });
    }

    const newBooking = new BookedSession({
      session: sessionId,
      student: studentId
    });

    await newBooking.save();

    return res.status(201).json({ 
        success: true, 
        message: "Session booked successfully" 
    });

  } catch (error) {
    
    return res.status(500).json({ 
        success: false, 
        message: "Something went wrong while booking session" 
    });
  }
};

// 2. Get My Booked Sessions (Student)
const getMyBookedSessions = async (req, res) => {
  try {
    const studentId = req.student?.id;

    const bookings = await BookedSession.find({ student: studentId })
      .populate("session");

    return res.status(200).json({ 
        success: true, 
        data: bookings 
    });

  } catch (error) {
    return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch your booked sessions" 
    });
  }
};

// 3. Cancel Booking (Student)
const cancelBooking = async (req, res) => {
  try {
    const studentId = req.student?.id;
    const { bookingId } = req.params;

    const booking = await BookedSession.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
    });
    }

    if (booking.student.toString() !== studentId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to cancel this booking" 
    });
    }

    await BookedSession.findByIdAndDelete(bookingId);

    return res.status(200).json({ 
        success: true, 
        message: "Booking cancelled successfully" 
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while cancelling booking" });
  }
};

// 4. Get All Bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookedSession.find()
      .populate("session")
      .populate("student", "name email avatar");

    return res.status(200).json({ 
        success: true, 
        data: bookings 
    });

  } catch (error) {
    console.error("Admin Booking Fetch Error:", error);
    return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch all bookings" 
    });
  }
};

// 5. Get Booked Students for a Session (Tutor/Admin)
const getBookedStudentsBySession = async (req, res) => {
  try {
    const { sessionId } = req?.params;

    const bookings = await BookedSession.find({ session: sessionId })
      .populate("student", "name email avatar");

    return res.status(200).json({ 
        success: true, 
        data: bookings 
    });

  } catch (error) {
    console.error("Get Students By Session Error:", error);
    return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch students for this session" 
    });
  }
};

module.exports = {
  bookSession,
  getMyBookedSessions,
  cancelBooking,
  getAllBookings,
  getBookedStudentsBySession
};
