// eslint-disable-next-line import/no-extraneous-dependencies
import db from '../database/models/index';
import generateToken from '../helpers/token_generator';

const { User } = db;

export const getAllUsers = async (req, res) => {
  const allUsers = await User.findAll();

  if (!allUsers) res.status(400).json({ message: 'No users found' });

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
      };
      const token = await generateToken(payload);
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Login successful',
        token,
      });
    } else {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      message: 'Failed to Login',
      error: error.message,
    });
  }
};

export default { getAllUsers, loginUser };
