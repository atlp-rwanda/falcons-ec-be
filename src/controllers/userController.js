/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../database/models/index';
import generateToken from '../helpers/token_generator';
import { BcryptUtility } from '../utils/bcrypt.util';
import { UserService } from '../services/user.service';
import verifyToken from '../utils/jwt.util';
import messageResetPassword from '../helpers/sendMessage';
import findOneUserService from '../services/authService';
import cloudinary from '../uploads';
import sendEmail from '../helpers/sendEmail';

dotenv.config();

const { clientURL } = process.env;

const { User } = db;

dotenv.config();
const API_KEY = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);
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

      if (user.status == 'false') {
        return res.status(403).json({ message: 'Account locked!' });
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
    user.lastPasswordUpdate = new Date();
    const { id, email } = await UserService.register(user);
    const userData = { id, email };
    const userToken = await generateToken(userData);
    const message = {
      from: `"Falcons Project" <${process.env.FROM_EMAIL}>`,
      to: userData.email,
      subject: 'Falcons project - Verify your account',
      text: `Hello, Thank you for registering on our site. Please click on this link to verify your email address: <a href="http://${process.env.url}/verify-account?token=${userToken}">Verify Account</a>. If you did not register for an account with Falcons Project, please ignore this email.`,
      html: `
        <h1> Hello,</h1>
        <p> Thanks for registering on our site.</p>
        <p> Please click on the button below to verify your account.</p>
        <a href="http://${process.env.url}/verify-account?token=${userToken}" style="background-color:#008CBA;color:#fff;padding:14px 25px;text-align:center;text-decoration:none;display:inline-block;border-radius:4px;font-size:16px;margin-top:20px;">Verify Account</a>
        <p>If you did not register for an account with Falcons Project, please ignore this email.</p>`,
    };
    await sendEmail(
      userData.email,
      process.env.FROM_EMAIL,
      'Falcons project - Verify your account',
      message.text,
      message.html,
    );

    return res.status(201).json({ user: userData, token: userToken });
  } catch (err) {
    return res.status(500).json({
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
      status: 'true',
      lastPasswordUpdate: new Date().getTime(),
    });
    res.status(201);

    res.json({ message: 'User created' });
  } catch (err) {
    res.status(400).json(err);
  }
};
const updatePassword = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = verifyToken(token);
    // find a user requesting yo update the password
    // compare his/her oldpassword to
    // password in the db

    const user = await User.findOne({
      where: { email: decoded.payload.email },
    });
    const { oldPassword, newPassword } = req.body;
    const match = bcrypt.compareSync(oldPassword, user.password);
    if (!match) {
      return res.status(403).json({ error: 'Incorrect password' });
    }
    // hash and update the new password in the db
    if (newPassword === oldPassword) {
      return res
        .status(406)
        .json({ error: 'Password must differ from old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    await user.update({
      password: hashPassword,
      lastPasswordUpdate: new Date(),
      status:'true',
    });
    await user.save();
    return res.status(200).json({ message: 'password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const userEmail = req.body.email;
    // find user in the database requesting to reset password

    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const token = await generateToken(user, { expiresIn: '10m' });
    await messageResetPassword(userEmail);
    return res.status(200).json({ token, message: 'email sent to the user' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const passwordReset = async (req, res) => {
  try {
    const { token } = req.params;
    const verify = verifyToken(token);
    if (!verify) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      res
        .status(400)
        .json({ error: 'Password and confirm password are required' });
    } else {
      // hash the password and update its fields in the database
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const Email = verify.payload.email;

      await User.update(
        { password: hashPassword },
        { where: { email: Email } },
      );
      return res.status(200).json({ message: 'Password reset successfully' });
    }
  } catch (error) {
    res.send(400).json({ message: error.message });
  }
};

const disableAccount = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'User email not provided' });
  }

  const foundUser = await User.findOne({ where: { email: req.params.id } });

  if (!foundUser) return res.status(404).json({ message: 'User not found' });
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
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify) {
      const verifiedUser = await User.findOne({
        where: { email: verify.payload.email },
      });
      verifiedUser.isVerified = true;
      await verifiedUser.save();
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Account successfully verified!',
      });
    }
    if (!verify) {
      return res.status(400).json({ status: 400, success: false });
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, success: false, message: error.message });
  }
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
  forgotPassword,
  passwordReset,
  disableAccount,
  updateProfile,
  getSingleProfile,
  verifyEmail,
};
