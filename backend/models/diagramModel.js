const mongoose = require('mongoose');

const diagramSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python'],
  },
  mermaid: {
    type: String,
    required: true,
  },
  shared: {
    type: Boolean,
    default: false,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Diagram = mongoose.model('Diagram', diagramSchema);

module.exports = Diagram; 