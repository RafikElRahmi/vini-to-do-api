import Session from "@models/session";
import { invalidateSession } from "@utils/auth/api/session/session";

export function sessionsChecker() {
  const interval = 5 * 60 * 1000;
  setInterval(checkSessions, interval);
}
const checkSessions = async () => {
  const now = new Date().getTime();
  const sessions = await Session.find();
  for (let session of sessions) {
    const sessionExpires = new Date(session.expires_at).getTime();
    if (now > sessionExpires) {
      session.valid = false;
      await session.save();
    }
  }
};
