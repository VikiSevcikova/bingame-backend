const nodemailer = require('nodemailer');

const sendMail = (emailTo, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: emailTo,
        subject: subject,
        html: message
      };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

module.exports = sendMail;