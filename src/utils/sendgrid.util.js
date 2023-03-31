import sgMail from '@sendgrid/mail';

const { SENDGRID_EMAIL } = process.env;
const sendMessage = async (receiver, message, subject) => {
  try {
    const Message = {
      to: receiver,
      from: SENDGRID_EMAIL,
      subject,
      text: message,
    };
    await sgMail.send(Message);
  } catch (error) {
    return error.message;
  }
};

export default sendMessage;
