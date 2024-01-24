const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
});

const DocumentModel = mongoose.model('Document', documentSchema);

module.exports = { DocumentModel };
