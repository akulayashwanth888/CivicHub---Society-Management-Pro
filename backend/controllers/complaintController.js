import Complaint from "../models/Complaint.js";

// CREATE COMPLAINT
export const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      userId: req.user.id,
      issue: req.body.issue,
    });

    res.status(201).json({
      message: "Complaint submitted",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY COMPLAINTS
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET ALL COMPLAINTS
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId", "name email");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: UPDATE STATUS
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Complaint status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
