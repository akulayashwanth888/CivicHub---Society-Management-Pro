import api from "./api";

// REGISTER USER
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// LOGIN USER
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  // Save token in browser
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// LOGOUT USER
export const logoutUser = () => {
  localStorage.removeItem("token");
};
