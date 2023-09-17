import nodemailer from "nodemailer";

async function sendResetEmail(email, userId, code) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to: email,
    subject: "Password Reset",
    text: `this message is very private`,
    html: `<p>Your password reset link: <a href='https://vini-to-do-frontend.vercel.app/resetpassword/${userId}?code=${code}'> reset your password from here</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    const error:any = "";
    return error;
  } catch (error:any) {
    return error;
  }
}

export default sendResetEmail;
