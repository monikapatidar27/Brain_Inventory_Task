const nodemailer = require("nodemailer");

const transporter = () => {
  console.log(process.env.MAIL_USER, process.env.MAIL_PASSWORD);
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

const send = async (to, subject, body) => {
  const transport = transporter();
  if (transport) {
    const email = {
      to: to.email,
      from: process.env.MAIL_USER,
      subject: subject,
      html: body,
    };

    try {
      let info = await transport.sendMail(email);
      console.log(`Email sent to ${to.email}: ${info.response}`);
    } catch (err) {
      console.error(`Error sending email: ${err}`);
      throw new Error("Failed to send email");
    }
  } else {
    throw new Error("Transporter configuration failed");
  }
};

module.exports = send;
