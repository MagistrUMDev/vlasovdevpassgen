const mongoose = require("mongoose");
const savedPasswordSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name!"],
    },
    password: {
      type: String,
      required: [true, "Please add a password!"],
    },
    user: {
      type: String, required: [true, "Please add a user!"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavedPassword", savedPasswordSchema);
