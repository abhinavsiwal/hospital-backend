const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");

exports.sendMail = async (email, subject, body) => {
  // configure AWS SDK
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_SES,
    secretAccessKey: process.env.AWS_SECRET_KEY_SES,
    region: "ap-south-1",
  });

  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: "2010-12-01",
    }),

  });

  transporter
    .sendMail({
      from: "abhinav@avisaindustries.com",
      to: email,
      subject,
      html: body,
    })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
};
