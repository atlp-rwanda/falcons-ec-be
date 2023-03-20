// // // import db from '../database/models/index';

// // const { User } = db;

// // export const getAllUsers = async (req, res) => {
// //   const allUsers = await User.findAll();

// //   if (!allUsers) res.status(400).json({ message: 'No users found' });

// //   res.json(allUsers);
// // };

// // export const createNewUser = async (req, res) => {
// //   try {
// //     const salt = await bcrypt.genSalt(10);
// //     const pwd = await bcrypt.hash(req.body.password, salt);

// //     const instance = await User.create({
// //       email: req.body.email,
// //       password: pwd,
// //     });

// //     res.json({ message: 'User created' });
// //   } catch (err) {
// //     res.status(400).json(err);
// //   }
// // };

// // export default { getAllUsers, createNewUser };
// import * as dotenv from "dotenv";
// // dotenv.config();
// // import bcrypt from "bcrypt";
// // import jwt from "jsonwebtoken";
// // import db from "../database/models/index";

// const { User } = db;

// const User = db["User"];
// export const getAllUsers = async (req, res) => {
//   const allUsers = await User.findAll();

// export const getAllUsers = async (req, res) => {
//   let allUsers = await User.findAll();

//   if (!allUsers) res.status(400).json({ message: "No users found" });

//   res.json(allUsers);
// };

// export const createNewUser = async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const pwd = await bcrypt.hash(req.body.password, salt);

//     const instance = await User.create({
//       email: req.body.email,
//       password: pwd,
//       role: "customer",
//       token: "",
//     });

//     res.json({ message: "User created" });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(err);
//   }
// };

// export const createNewAdmin = async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const pwd = await bcrypt.hash(req.body.password, salt);

//     const instance = await User.create({
//       email: req.body.email,
//       password: pwd,
//       role: "admin",
//       token: "",
//     });

//     res.json({ message: "User created" });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(err);
//   }
// };

// export const login = async (req, res) => {
//   const foundUser = await User.findOne({ where: { email: req.body.email } });

//   if (!foundUser) return res.sendStatus(400);

//   const token = jwt.sign(
//     {
//       userInfo: {
//         names: foundUser.name,
//         email: foundUser.email,
//         role: foundUser.role,
//       },
//     },
//     process.env.JWT_SEKRET,
//     { expiresIn: "1h" }
//   );

//   foundUser.token = token;
//   let result = await foundUser.save();
//   return res.json({ message: "login successful", token: result.token });
// };

// export default { getAllUsers, createNewUser, login, createNewAdmin };
