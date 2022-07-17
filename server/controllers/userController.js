const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

//Registration Process
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please add all fields!" });
  }

  //Check If User Exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  //Check If Made User Exists
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid User Data!" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check If Email Exists
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid credentials!" });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (users) {
    return res.status(200).json(users);
  }
});

const getUser = asyncHandler(async (req, res) => {
  const oneUser = await User.findOne({ _id: req.params.id });
  if (oneUser) {
    res.status(200).json({
      _id: oneUser.id,
      name: oneUser.name,
      email: oneUser.email,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
};
