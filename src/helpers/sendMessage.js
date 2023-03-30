import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env.API_KEY);
const { SENDGRID_EMAIL } = process.env;
let token, clientURL;

const messageResetPassword = async (email) => {
  try {
    const link = `<a href="${clientURL}/api/v1/users/${token}/password-reset">
    <b style="font-size: 18px; background: blue; color:white; width: 300px; height: 300px;
    padding: 7px; margin: 10px">Reset password</b></a>`;
    const emailMessage = {
      to: email,
      from: {
        name: 'E-commerce application',
        email: SENDGRID_EMAIL,
      },
      subject: 'Password Reset',
      html: `<p><p><strong style="font-size: 18px">Hello</strong> ${email}, </p><br>
      <b>A request has been recieved to change password for your E-commerce account</b>
      <br></p><p>Click the link below to reset your email <br>
      ${link}
      <br>
      <br>
      <span>If you did not initiate this request, ignore this message</span>
      </p>`
    };
    const sendEmail = await sgMail.send(emailMessage);
    return sendEmail;
  } catch (error) {
    return error.message;
  }
};
export default messageResetPassword;
