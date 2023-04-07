const nodemailer = require('nodemailer');
require('dotenv').config();
var smtpConfig = {
  service: process.env.HOST_TRANSPORTER,
  auth: {
      user: process.env.EMAIL_TRANSPORTER,
      pass: process.env.PASS_TRANSPORTER
  }
};
var transporter = nodemailer.createTransport(smtpConfig);

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to use nodemailer");
    }
  });

module.exports = transporter;