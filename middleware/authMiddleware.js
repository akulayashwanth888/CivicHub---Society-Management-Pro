const jwt = require("jsonwebtoken");

// AUTH MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ADMIN ONLY MIDDLEWARE
const adminOnly = (req, res, next) => {
  console.log("USER ROLE:", req.user.role);

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};


module.exports = {
  auth,
  adminOnly
};

