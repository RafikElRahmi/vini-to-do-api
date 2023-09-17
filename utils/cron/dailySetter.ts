import User from "@models/user";

export function dailyMailsSetter() {
  const now = new Date().getTime();
  let nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = nextMidnight.getTime() - now;
  const interval = 24 * 60 * 60 * 1000;
  setTimeout(() => {
    setDailyMails();
    setInterval(setDailyMails, interval);
  }, timeUntilMidnight);
}
const setDailyMails = async () => {
  const users = await User.find();
  for (let user of users) {
    user.reset_code.daily_mails = 5;
    await user.save();
  }
};
