const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
} = require("../controllers/userController");

const { protectAdmin } = require("../middlewares/authMiddleware");

router.post("/api/users/", registerUser);
router.post("/api/users/login", loginUser);
router.get("/api/users/", protectAdmin, getUsers);
router.get("/api/user/:id", protectAdmin, getUser);

module.exports = router;
