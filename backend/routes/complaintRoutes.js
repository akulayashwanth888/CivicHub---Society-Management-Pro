import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { auth, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// RESIDENT
router.post("/", auth, createComplaint);
router.get("/my", auth, getMyComplaints);

// ADMIN
router.get("/all", auth, adminOnly, getAllComplaints);
router.put("/:id/status", auth, adminOnly, updateComplaintStatus);

export default router;
