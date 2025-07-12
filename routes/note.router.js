const express = require('express');
const studentAuthentication = require('../middlewares/studentAuth.middleware');
const { createNote, getMyNotes, updateNote, deleteNote } = require('../controllers/note.controllers');

const noteRouter = express.Router();

// -------------------- STUDENT ROUTERS --------------------

// Create a new note
noteRouter.post('/student',studentAuthentication, createNote);

// Get all notes created by the logged-in student
noteRouter.get('/student',studentAuthentication, getMyNotes);

// Update a specific note (only if it belongs to the student)
router.patch('/student/:noteId',studentAuthentication, updateNote);

// Delete a specific note (only if it belongs to the student)
noteRouter.delete('/student/:noteId',studentAuthentication, deleteNote);

module.exports = noteRouter;
