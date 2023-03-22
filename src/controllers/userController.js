// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import db from '../database/models/index';
import generateToken from '../helpers/token_generator';
import { BcryptUtility } from '../utils/bcrypt.util';
import { UserService } from '../services/user.service';

const { User } = db;

const getAllUsers = async (req, res) => {
  const allUsers = await User.findAll();

  if (!allUsers) res.status(400).json({ message: 'No users found' });

  res.json(allUsers);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await user.checkPassword(password))) {
      const payload = {
        id: user.id,
        email,
        role: user.role,
        status: user.status
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
export const registerUser = async (req, res) => {
  try {
    const user = { ...req.body };
    user.password = await BcryptUtility.hashPassword(req.body.password);
    const { id, email } = await UserService.register(user);
    const userData = { id, email };
    const userToken = await generateToken(userData);
    return res.status(201).json({ user: userData, token: userToken });
  } catch (err) {
    return res.status(500).jsonp({
      error: err.message,
      message: 'Failed to register a new user',
    });
  }
};

const setRoles = async (req, res) => {
  if (!req.params.id) { return res.status(400).json({ message: 'User ID not provided' }); }

  const foundUser = await User.findOne({ where: { email: req.params.id } });

  if (!foundUser) return res.status(400).json({ message: 'User not found' });

  foundUser.role = req.body.role;
  const result = await foundUser.save();

  return res.json({ message: 'User role updated' });
};

// user registration for testing purposes
const createNewUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);

    const instance = await User.create({
      email: req.body.email,
      password: pwd,
      role: 'admin',
      status: true,
      token: '',
    });
    res.status(201);
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(400).json(err);
  }
};
const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    // find a user requesting yo update the password
    // compare his/her oldpassword to
    // password in the db
    const user = await User.findByPk(userId);
    const { oldPassword, newPassword } = req.body;
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(403)
        .json({ error: 'Invalid password' });
    }
    // hash and update the new password in the db

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashPassword });
    await user.save();
    return res.status(200).json({ message: 'password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const disableAccount = async (req, res) => {
  if (!req.params.id) { return res.status(400).json({ message: 'User ID not provided' }); }

  const foundUser = await User.findOne({ where: { email: req.params.id } });

  if (!foundUser) return res.status(400).json({ message: 'User not found' });

  let message = '';
  if (foundUser.status === true) {
    foundUser.status = false;
    message = 'Account disabled';
  } else {
    foundUser.status = true;
    message = 'Account Enabled';
  }

  const result = await foundUser.save();

  return res.json({ message });
};

export {
  getAllUsers, loginUser, setRoles, createNewUser, updatePassword, disableAccount
};
