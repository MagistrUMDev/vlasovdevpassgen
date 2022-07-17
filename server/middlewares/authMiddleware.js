const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get Token From Header
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const decoded = jwt.verify(token, "MAGISTR_UM_DEV");

      //Get User From The Token
      req.user = await User.findById(decoded.id).select("-password");
      req.userAdmin = await User.findById(decoded.id).select("isAdmin");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized!" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  protect(req, res, next, () => {
    if (req.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden!" });
    }
  });
});

module.exports = { protect, protectAdmin };
