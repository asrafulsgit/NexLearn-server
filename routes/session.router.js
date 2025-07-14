const express = require('express');
const sessionRouter = express.Router();


const { getAllSessionsAdmin, getSessionById, createSession, updateSession, deleteSession, approveSession, rejectSession, getAllSessionsTutor, availableSessions, getAllSessions } = require('../controllers/session.controllers');
const studentAuthentication = require('../middlewares/studentAuth.middleware');
const tutorAuthentication = require('../middlewares/tutorAuth.middleware');
const adminAuthentication = require('../middlewares/adminAuth.middleware');

// -------------------- PUBLIC (Auth Required) --------------------

// get all availabe session
sessionRouter.get('/user', getAllSessions);

// get availabe session
sessionRouter.get('/user/available', availableSessions);

// Get single session by ID (any logged-in user)
sessionRouter.get('/user/:seesionId', studentAuthentication, getSessionById);

// -------------------- TUTOR ROUTES --------------------

// get all sessions created by tutor
sessionRouter.get('/tutor', tutorAuthentication, getAllSessionsTutor);

// Create a new session
sessionRouter.post('/tutor', tutorAuthentication, createSession);

// re submit session
sessionRouter.put('/tutor/re-submit/:sessionId', tutorAuthentication, createSession);

// Update a session (only tutor who created it)
sessionRouter.put('/tutor/:sessionId', tutorAuthentication, updateSession);

// Delete a session (only tutor who created it)
sessionRouter.delete('/tutor/:sessionId', tutorAuthentication, deleteSession);

// -------------------- ADMIN ROUTES --------------------
// Get all sessions  
sessionRouter.get('/admin', adminAuthentication, getAllSessionsAdmin);
// Approve a session
sessionRouter.put('/admin/approve/:sessionId', adminAuthentication,approveSession);

// Reject a session with reason
sessionRouter.put('/admin/reject/:sessionId', adminAuthentication, rejectSession);

module.exports = sessionRouter;
