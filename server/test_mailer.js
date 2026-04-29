import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    console.log(`Sending email as ${process.env.EMAIL_USER}...`);
    let info = await transporter.sendMail({
      from: `"Nike Football Shop" <${process.env.EMAIL_USER}>`,
      to: 'ngyntantai76@gmail.com', // send to self
      subject: "Test Email from Local",
      html: "<b>Hello world!</b>",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

run();
