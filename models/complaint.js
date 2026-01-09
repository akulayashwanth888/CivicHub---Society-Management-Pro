const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  issue: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Complaint", complaintSchema);
