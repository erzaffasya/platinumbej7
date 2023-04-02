const nodemailer = require('nodemailer');
require('dotenv').config();


// const transporter = nodemailer.createTransport({
//     service: c,
//     auth: {
//         user: process.env.EMAIL_TRANSPORTER,
//         pass: process.env.PASS_TRANSPORTER
//     }
// });

var smtpConfig = {
  host: process.env.HOST_TRANSPORTER,
  port: 465,
  // secure: true, // use SSL
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