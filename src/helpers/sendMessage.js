import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.API_KEY);
const { clientURL } = process.env;

const messageResetPassword = (token) => {
  const link = `<a href="${clientURL}/api/v1/users/${token}/password-reset">Reset password</a>`;
  return link;
};
const sendVerifyEmail = (token) => {
  const message = `Hello, Thank you for registering on our site. Please click on this link to verify your email address: <a href="http://${clientURL}/verify-account?token=${token}">Verify Account</a>. If you did not register for an account with Falcons Project, please ignore this email.`;
  return message;
};

const sendOTPEmail = (otp) => {
  const message = `Hello, ${otp} is your OTP code. It will expire in 5 minutes, use the below button to verify it and If you did not request for an OTP code, please ignore this email.`;
  return message;
};
const productsExpiration = (id) => {
  const message = `The following product has reached its expiration date ${id}`;
  return message;
};

export {
  messageResetPassword,
  sendVerifyEmail,
  sendOTPEmail,
  productsExpiration,
};
