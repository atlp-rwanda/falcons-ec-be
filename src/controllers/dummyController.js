import db from '../database/models/index';

const { User } = db;

export const getAllUsers = async (req, res) => {
  const allUsers = await User.findAll();

  if (!allUsers) res.status(400).json({ message: 'No users found' });

  res.json(allUsers);
};

export default { getAllUsers };
