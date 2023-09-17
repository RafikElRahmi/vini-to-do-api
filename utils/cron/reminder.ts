import Event from "@models/event";
import User from "@models/user";
import nodemailer  from 'nodemailer';

export const reminder = () => {
  const interval = 60 * 1000;
  reminderSender()
  setInterval(reminderSender, interval);
};
const getMunite = (time) => {
  const modifiedTime = new Date(time);
  modifiedTime.setSeconds(0, 0);
  return modifiedTime.getTime();
};
const reminderSender = async () => {
  const current = new Date();
  const events = await Event.find();
  for (let event of events) {
    const beforeHour = getMunite(new Date(event.date)) - 60 * 60 * 1000;
    if (beforeHour === getMunite(current)) {
      console.log('its worked');
      await sendReminder(event.title, event.userId);
    }
  }
};

const sendReminder = async (title, userId) => {
  const user = await User.findOne({ _id: userId });
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL}`,
    to: user.email,
    subject: "TO-DO Reminder",
    text: `this message is task reminder`,
    html: `<p>Dear ${user.username}, <br/> You have a task that start in 1 hour <br/> <strong>${title}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    const error: any = "";
    return error;
  } catch (error: any) {
    return error;
  }
};
