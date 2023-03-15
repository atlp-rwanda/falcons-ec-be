// import db from '../database/models/index';

// const { User } = db;

// export const getAllUsers = async (req, res) => {
//   const allUsers = await User.findAll();

//   if (!allUsers) res.status(400).json({ message: 'No users found' });

//   res.json(allUsers);
// };

// export const createNewUser = async (req, res) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const pwd = await bcrypt.hash(req.body.password, salt);

//     const instance = await User.create({
//       email: req.body.email,
//       password: pwd,
//     });

//     res.json({ message: 'User created' });
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// export default { getAllUsers, createNewUser };
