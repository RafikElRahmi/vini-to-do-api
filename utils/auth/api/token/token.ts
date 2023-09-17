import { Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./generateToken";
import Session from "@models/session";

export const setToken = (res: Response, access, refresh?) => {
  //@ts-ignore
  res.setHeader("Authorization", `Bearer ${access.token}`);
  res.setHeader("Expiration", `${access.expires}`);
  if (refresh) {
    res.setHeader("authentication", `Bearer ${refresh.token}`);
    res.setHeader("Refresh-Expiration", `${refresh.expires}`);
  }
};
export function getToken(req) {
  const access_token = req.headers.authorization?.split(" ")[1] || "";
  const refresh_token = req.headers.authentication?.split(" ")[1] || "";
  return { access_token, refresh_token };
}

export async function createLoginTokens(res: Response, userId: string) {
  const access = generateAccessToken(userId);
  const refresh = await generateRefreshToken(userId);
  setToken(res, access, refresh);
}

export async function refreshTokens(res: Response, refresh: any) {
  const access = generateAccessToken(refresh.userId);
  const refreshIfLessThan = new Date(Date.now() + 4 * 24 * 3600 * 1000);
  const expires = new Date(refresh.exp * 1000);
  if (refreshIfLessThan > expires) {
    const refreshData = await generateRefreshToken(
      refresh.userId,
      refresh.sessionId
    );
    setToken(res, access, refreshData);
  } else {
    setToken(res, access);
  }
}
export async function verifyVersions(refresh: any) {
  const sessionVersion = await Session.findById(refresh.sessionId);
  return sessionVersion.version === refresh.version && sessionVersion.valid;
}
export function verifyExpires(expiresTime: any) {
  const expires = new Date(expiresTime * 1000).getTime();
  const now = new Date().getTime();
  return now > expires;
}
