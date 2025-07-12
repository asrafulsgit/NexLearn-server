const Session = require("../models/session.model");

// Create a new session (Tutor)
const createSession = async (req, res) => {
 
  try {
    const { id } = req.tutor;

     if (!id) {
      return res.status(404).json({
        success: false,
        message: "tutor id is required",
      });
    } 

    const {
      title,
      description,
      image,
      registrationStart,
      registrationEnd,
      classStart,
      classEnd,
      duration,
    } = req.body;

    if (
      !title ||
      !description ||
      !image ||
      !registrationStart ||
      !registrationEnd ||
      !classStart ||
      !classEnd ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newSession = new Session({
      title,
      description,
      image,
      registrationStart,
      registrationEnd,
      classStart,
      classEnd,
      duration,
      tutor: id,
    });

    await newSession.save();
    return res
      .status(201)
      .json({
        success: true,
        message: "Session created successfully",
        session: newSession,
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

// Get all sessions (admin)
const getAllSessionsAdmin = async (req, res) => {
  try {
    const sessions = await Session.find().populate("tutor", "name email");
    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sessions",
      error: err.message,
    });
  }
};
// Get all sessions (tutor)
const getAllSessionsTutor = async (req, res) => {
  try {
    const { id } = req.tutor;

     if (!id) {
      return res.status(404).json({
        success: false,
        message: "tutor id is required",
      });
    }
    const sessions = await Session.find({ tutor: id }).populate(
      "tutor",
      "name email"
    );
    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve sessions",
      error: err.message,
    });
  }
};

// Get single session by ID
const getSessionById = async (req, res) => {
  try {
    const id = req.params.sessionId;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Session id required",
      });
    }
    const session = await Session.findById(id).populate("tutor", "name email");
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }
    return res.status(200).json({
      success: true,
      session,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve session",
      error: err.message,
    });
  }
};

// Update session (only by the tutor who created it)
const updateSession = async (req, res) => {
  try {
    const id = req.params?.sessionId;
    const tutorId = req.tutor?.id;

    if (!id || !tutorId) {
      return res.status(404).json({
        success: false,
        message: "Session id required",
      });
    }
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }
    if (session.tutor.toString() !== tutorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this session",
      });
    }

    const allowedUpdates = [
      "title",
      "description",
      "image",
      "registrationStart",
      "registrationEnd",
      "classStart",
      "classEnd",
      "duration",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();
    return res.status(200).json({
      success: true,
      message: "Session updated",
      session,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update session",
      error: err.message,
    });
  }
};

// Delete session (only by the tutor who created it)
const deleteSession = async (req, res) => {
  try {
    const id = req.params?.sessionId;
    const tutorId = req.tutor?.id;

    if (!id || !tutorId) {
      return res.status(404).json({
        success: false,
        message: "Session id required",
      });
    }
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }
    if (session.tutor.toString() !== tutorId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this session",
      });
    }
    await session.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Session deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete session",
      error: err.message,
    });
  }
};

// Approve session (Admin only)
const approveSession = async (req, res) => {
  try {
    const id = req.params?.sessionId;

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Session id required",
      });
    }
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    session.status = "approved";
    session.fee = req.body.fee || 0;
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Session approved successfully",
      session,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to approve session",
      error: err.message,
    });
  }
};

// Reject session (Admin only)
const rejectSession = async (req, res) => {
  try {
    const id = req.params.sessionId;
    
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Session id required",
      });
    }
    const { reason, feedback } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const session = await Session.findById();
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    session.status = "rejected";
    session.rejectionReason = reason;
    session.feedback = feedback || "";
    await session.save();

    return res.status(200).json({
      success: true,
      message: "Session rejected successfully",
      session,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reject session",
      error: err.message,
    });
  }
};

// GET: Recent 6 Approved Sessions
const availableSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'approved' })
      .sort({ createdAt: -1 }) 
      .limit(6);

    return res.status(200).json({
      success: true,
      message: 'Fetched  available sessions successfully',
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch available sessions',
    });
  }
};
// GET all approved Sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'approved' })
      .sort({ createdAt: -1 }) 

    return res.status(200).json({
      success: true,
      message: 'Fetched all available sessions successfully',
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch all available sessions',
    });
  }
};

module.exports = {
  createSession,
  getAllSessionsAdmin,
  getAllSessionsTutor,
  getSessionById,
  updateSession,
  deleteSession,
  approveSession,
  rejectSession,
  availableSessions,
  getAllSessions
};
