/* eslint-disable linebreak-style */
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
const API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(API_KEY);

// Reusable function to send different types of emails
const sendEmail = (to, from, subject, message, text) => {
  const email = {
    to,
    from,
    subject,
    html: message,
    text,
  };

  return sgMail.send(email);
};
export default sendEmail;
