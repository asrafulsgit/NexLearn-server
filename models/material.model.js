const mongoose = require('mongoose')

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  driveLink: { type: String },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudySession',
    required: true
  }
}, { timestamps: true, versionKey : false });

const Material= mongoose.model('Material', materialSchema);
module.exports = Material;
