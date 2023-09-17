import { dailyMails, isExpired } from "./check";
import generateCode from "../generateCode";
import sendResetEmail from "./createEmail";
import nodemailer from 'nodemailer'
async function emailSender(user) {
  let code: string = "";
  let daily_mails: number = 0;
  let dailyValidation: Boolean = false;
  let sendingValidation: Boolean = true;
  let expire_at: string = "";
  let nextMidnight: any = "";
  let error: any = "";
  let next_send_time;
  try {
    const { next_send, new_next_send_time } = isExpired(
      user.reset_code?.next_send_time
    );
    if (next_send) {
      nextMidnight = new Date(new Date().setHours(24, 0, 0, 0));
      const actual_mail =
        user.reset_code?.daily_mails === 0
          ? 0
          : user.reset_code?.daily_mails || 5;
      const { daily, dailyValid } = dailyMails(actual_mail);
      dailyValidation = dailyValid;
      if (dailyValid) {
        code = generateCode();
        error = await sendResetEmail(user.email, user._id, code);
        if (error === "") {
          daily_mails = daily - 1;
          next_send_time = new_next_send_time;
          expire_at = `${new Date(Date.now() + 30 * 60 * 1000)}`;
        }
      }
    } else {
      sendingValidation = false;
    }
  } catch (err) {
    error = err;
  } finally {
    return {
      code,
      errorSending: error,
      expire_at,
      daily_mails,
      next_send_time,
      dailyValidation,
      sendingValidation,
      nextMidnight,
    };
  }
}
export async function sendVerificationCode(email) {
  const code = generateCode();
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
    subject: "verify code",
    text: `this message is very private`,
    html: `<p>Your activation code : <h2><strong>${code}</strong></h2></p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    const next_send = new Date(Date.now() + 5 * 60 * 1000);
    return {code,next_send}
  } catch (error) {
    console.log(error)
    return { code:null, next_send:null };

  }
}

export default emailSender;
