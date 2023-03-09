import db from "../models/index";

const User = db["User"];

export const getAllUsers = async (req, res) => {
  let allUsers = await User.findAll();

  if (!allUsers) res.status(400).json({ message: "No users found" });

  res.json(allUsers);
};

export const createNewUser = async (req, res) => {
  try {
    const instance = await User.create({
      name: req.body.name,
      email: req.body.email,
    });

    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json(err);
  }
};

export default { getAllUsers, createNewUser };
