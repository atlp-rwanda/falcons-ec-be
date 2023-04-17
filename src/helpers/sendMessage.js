import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.API_KEY);
const { clientURL } = process.env;

const messageResetPassword = (token) => {
  const html = `<h1> Hello</h1>
    <p><b>A request has been recieved to reset your password for your E-commerce account</b></p>
    <a href="${process.env.clientURL}/api/v1/users/${token}/password-reset" style="background-color:#008CBA;color:#fff;padding:14px 25px;text-align:center;text-decoration:none;display:inline-block;border-radius:4px;font-size:16px;margin-top:20px;">Reset password</a>
    <p>If you did not initiate this request, please ignore this email.</p>`;
  return html;
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
