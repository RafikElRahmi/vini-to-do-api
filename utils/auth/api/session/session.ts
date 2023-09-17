import Session from "@models/session";

export async function createSession(payload) {
  const newSession = await Session.create(payload);
  return newSession._id;
}

export async function updateSession(sessionId, version, expires_at) {
  const updatedSession = await Session.findByIdAndUpdate(
    { _id: sessionId },
    { $set: { version, expires_at } },
    { new: true }
  );
  return updatedSession;
}

export async function invalidateSession(sessionId) {
  const updatedSession = await Session.findByIdAndUpdate(
    { _id: sessionId },
    { $set: { valid: false } },
    { new: true }
  );
  return updatedSession;
}
