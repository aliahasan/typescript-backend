import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'aanabin18@gmail.com',
      pass: 'qads byps eqzo sgjf',
    },
  });
  await transporter.sendMail({
    from: config.sender_email, // sender address
    to: to, // list of receivers
    subject: 'Request for reset password', // Subject line
    text: 'Reset you password with 10 min', // plain text body
    html: html, // html body
  });
};
