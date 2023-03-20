// eslint-disable-next-line import/no-extraneous-dependencies
import db from "../database/models/index";
import generateToken from "../helpers/token_generator";
import bcrypt from "bcrypt";

const { User } = db;

export const getAllUsers = async (req, res) => {
  const allUsers = await User.findAll();

  if (!allUsers) res.status(400).json({ message: "No users found" });

  res.json(allUsers);
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await user.checkPassword(password))) {
      const payload = {
        id: user.id,
        email,
        role: user.role
      };
      const token = await generateToken(payload);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Login successful",
        token,
      });
    } else {
      res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      message: "Failed to Login",
      error: error.message,
    });
  }
};

export const setRoles = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "User ID not provided" });

  const foundUser = await User.findOne({ where: { email: req.params.id } });

  if (!foundUser) return res.status(400).json({ message: "User not found" });

  foundUser.role = req.body.role;
  const result = await foundUser.save();

  return res.json({ message: "User role updated" });
};

//user registration for testing purposes
export const createNewUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);

    const instance = await User.create({
      email: req.body.email,
      password: pwd,
      role: "admin",
      token: "",
    });

    res.json({ message: "User created" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

export default { getAllUsers, loginUser, setRoles, createNewUser };
