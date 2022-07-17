const asyncHandler = require("express-async-handler");
const SavedPassword = require("../models/savedPasswordModel");

const newPassword = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "Please add all fields!" });
  }
  const savedPassword = await SavedPassword.create({
    name: name,
    password,
    user: req.user.id,
  });

  res.status(201).json(savedPassword);
});

const deletePassword = asyncHandler(async (req, res, next) => {
  //Check If Password Exists
  const passwordExists = await SavedPassword.findById(req.params.id);
  if (!passwordExists) {
    return res.status(404).json({ message: "Password doesn't exist!" });
  }

  //Make sure the logged in user matches the one, whose password we want to delete

  if (passwordExists.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  await passwordExists.remove();

  res.status(201).json({ id: req.params.id, });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  //Check If Password Exists
  const passwordExists = await SavedPassword.findById(req.params.id);
  if (!passwordExists) {
    res.status(404).json({ message: "Password doesn't exist!" });
  }
  //Make sure the logged in user matches the one, whose password we want to update

  if (passwordExists.user.toString() !== req.user.id) {
    res.status(401).json({ message: "Unauthorized!" });
  }

  const updatedPassword = await SavedPassword.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(201).json(updatedPassword);
});

const getPasswords = asyncHandler(async (req, res, next) => {
  const userPasswords = await SavedPassword.find({ user: req.user.id });
  res.status(200).json(userPasswords);
});

module.exports = {
  newPassword,
  deletePassword,
  updatePassword,
  getPasswords,
};
