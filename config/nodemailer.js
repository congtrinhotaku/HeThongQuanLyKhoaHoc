// config/nodemailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // Gmail
    pass: process.env.EMAIL_PASS,   // App Password 16 ký tự
  },
  
});

module.exports = transporter;
