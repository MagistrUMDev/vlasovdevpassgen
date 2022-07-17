const express = require("express");
const router = express.Router();
const {
  newPassword,
  deletePassword,
  updatePassword,
  getPasswords,
} = require("../controllers/savedPasswordController");

const { protect } = require("../middlewares/authMiddleware");

router
  .route("/api/savedpasswords/")
  .post(protect, newPassword)
  .get(protect, getPasswords);

router
  .route("/api/savedpasswords/:id")
  .delete(protect, deletePassword)
  .put(protect, updatePassword);

module.exports = router;
