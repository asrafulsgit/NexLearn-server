const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
},
  content: { 
    type: String 
},
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true, versionKey : false });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;