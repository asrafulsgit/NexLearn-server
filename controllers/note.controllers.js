const Note = require("../models/note.model");


// Create Note
const createNote = async (req, res) => {
    const studentId = req.student?.id;
  try {
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "student id is required.",
      });
    }
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const newNote = new Note({
      title,
      content,
      student: studentId,
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};

// Get notes created by student
const getMyNotes = async (req, res) => {
    const studentId = req.student?.id;
  try {
    if (!studentId) {
        return res.status(400).json({
            success: false,
            message: "student id is required.",
        });
        }
    const notes = await Note.find({ student: studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message : 'notes fetched',
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

// Update note
const updateNote = async (req, res) => {
    const noteId = req.params.id;
    const studentId = req.student?.id;
  try {
     if (!studentId || !noteId) {
        return res.status(400).json({
            success: false,
            message: "student and note id are required.",
        });
        }
    const { title, content } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this note",
      });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    await note.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
    const noteId = req.params.id;
    const studentId = req.student?.id;
  try {
    if (!studentId || !noteId) {
            return res.status(400).json({
                success: false,
                message: "student and note id are required.",
            });
            }
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this note",
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};

module.exports = {
  createNote,
  getMyNotes,
  updateNote,
  deleteNote,
};


