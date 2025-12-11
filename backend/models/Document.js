// models/Document.js
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  pdfId: { type: String, required: true },
  originalHash: { type: String, required: true },
  signedHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
