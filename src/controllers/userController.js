// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import db from '../database/models/index';
import generateToken from '../helpers/token_generator';
import { BcryptUtility } from '../utils/bcrypt.util';
import { UserService } from '../services/user.service';
import findOneUserService from '../services/authService';
import cloudinary from '../uploads';

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
        status: user.status,
      };

      if (user.status !== 'true') {
        return res.status(403).json({ message: 'Account locked!' });
      } else if (user.status == 'NeedsToUpdatePassword') {
        return res.status(419).json({
          status: 419,
          success: false,
          message: 'Please Update Your Password',
        });
      }

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
  if (!req.params.id) {
    return res.status(400).json({ message: 'User email not provided' });
  }

  const foundUser = await User.findOne({ where: { email: req.params.id } });

  if (!foundUser) return res.status(404).json({ message: 'User not found' });

  foundUser.role = req.body.role;
  // eslint-disable-next-line no-unused-vars
  const result = await foundUser.save();

  return res.json({ message: 'User role updated' });
};

// user registration for testing purposes
const createNewUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(req.body.password, salt);

    // eslint-disable-next-line no-unused-vars
    const instance = await User.create({
      email: req.body.email,
      password: pwd,
      role: 'admin',
      status: true,
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
    const user = await User.findByPk(userId);
    const { oldPassword, newPassword } = req.body;
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashPassword,lastPasswordUpdate: new Date()});
    await user.save();
    return res.status(200).json({ message: 'password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const disableAccount = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'User email not provided' });
  }

  const foundUser = await User.findOne({ where: { email: req.params.id } });

  if (!foundUser) return res.status(404).json({ message: 'User not found' });

  let message = '';
  if (foundUser.status === 'true') {
    foundUser.status = 'false';
    message = 'Account disabled';
  } else {
    foundUser.status = 'true';
    message = 'Account Enabled';
  }

  // eslint-disable-next-line no-unused-vars
  const result = await foundUser.save();

  return res.json({ message });
};

const updateProfile = async (req, res) => {
  try {
    const updateData = req.body;
    if (!Object.keys(updateData).length) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'No data provided',
      });
    }

    const user = await findOneUserService(req.user.id);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Falcons_E-comm_App/ProductImages',
        public_id: `${user.firstname}_image`,
      });
      updateData.avatar = result.url;
    }

    const updatedProfile = await user.update(updateData, {
      where: {
        id: user.id,
      },
      returning: true,
    });

    const returnedProfile = {
      firstname: updatedProfile.firstname,
      lastname: updatedProfile.lastname,
      gender: updatedProfile.gender,
      birthDate: updatedProfile.birthDate,
      preferredLanguage: updatedProfile.preferredLanguage,
      preferredCurrency: updatedProfile.preferredCurrency,
      BillingAddress: updatedProfile.billingAddress,
      avatar: updatedProfile.avatar,
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Profile updated successfully',
      data: returnedProfile,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: `Internal Server Error ${error.message}`,
    });
  }
};
const getSingleProfile = async (req, res) => {
  try {
    const profileId = req.user.id;
    const profile = await findOneUserService(profileId);
    const profileData = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      gender: profile.gender,
      birthDate: profile.birthDate,
      preferredLanguage: profile.preferredLanguage,
      preferredCurrency: profile.preferredCurrency,
      BillingAddress: profile.billingAddress,
      avatar: profile.avatar,
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: profileData,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      success: false,
      message: 'Failed to get the profile',
      error: error.message,
    });
  }
};

export {
  getAllUsers,
  loginUser,
  setRoles,
  createNewUser,
  updatePassword,
  disableAccount,
  updateProfile,
  getSingleProfile,
};
