import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Checks that the user is logged in (has a valid token)
export const protect = async (req, res, next) => {
  let token;

  // The token arrives in the header like: "Bearer xxxxxxx"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify the token using the same secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the DB (without the password) and attach to req
      req.user = await User.findById(decoded.id).select("-password");

      next(); // all good, move on to the route
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token provided, please log in" });
  }
};

// Checks that the user is an admin (must run after protect)
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized, admin access only" });
  }
};