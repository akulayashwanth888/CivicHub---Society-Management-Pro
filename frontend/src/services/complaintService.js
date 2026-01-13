import api from "./api";

// CREATE COMPLAINT (Resident)
export const createComplaint = async (data) => {
  const response = await api.post("/complaints", data);
  return response.data;
};

// GET MY COMPLAINTS (Resident)
export const getMyComplaints = async () => {
  const response = await api.get("/complaints/my");
  return response.data;
};

// GET ALL COMPLAINTS (Admin)
export const getAllComplaints = async () => {
  const response = await api.get("/complaints/all");
  return response.data;
};

// UPDATE COMPLAINT STATUS (Admin)
export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/complaints/${id}/status`, { status });
  return response.data;
};
