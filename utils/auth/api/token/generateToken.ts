import Session from "@models/session";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { createSession, updateSession } from "../session/session";

export function generateAccessToken(userId: string) {
  const expiresIn: number = 300;
  const secretKey: string = `${process.env.SECRET_KEY}`;
  const token: string = jwt.sign({ userId }, secretKey, {
    expiresIn: expiresIn,
  });
  const expires = new Date(Date.now() + expiresIn * 1000);
  return { token, expires };
}

export async function generateRefreshToken(userId: string, sessionId?: string) {
  const expiresIn: number = 3600 * 24 * 7;
  const expires = new Date(Date.now() + expiresIn * 1000);
  const version = uuidv4();
  const sessionPayload = { version, expires_at: expires, userId };
  const session = sessionId || (await createSession(sessionPayload));
  const secretKey = `${process.env.SECRET_KEY_REFRESH}`;
  const token: string = jwt.sign(
    { userId, version, sessionId: session },
    secretKey,
    {
      expiresIn: expiresIn,
    }
  );
  if (sessionId) {
    await updateSession(session, version, expires);
  }
  return { token, expires };
}
