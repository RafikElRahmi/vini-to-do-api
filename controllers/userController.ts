import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@models/user";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/auth/api/token/generateToken";
import hash from "@utils/auth/api/hash";
import logError from "@utils/logger";
import emailSender, {
  sendVerificationCode,
} from "@utils/auth/api/mail/emailSender";
import {
  dailyLogged,
  isCodeExpired,
  isExpired,
  setDailyExpires,
} from "@utils/auth/api/mail/check";
import {
  decodeAccessToken,
  decodeRefreshToken,
} from "@utils/auth/api/token/decodeToken";
import {
  createLoginTokens,
  getToken,
  refreshTokens,
  setToken,
  verifyExpires,
  verifyVersions,
} from "@utils/auth/api/token/token";
import Session from "@models/session";

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Invalid username or password");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("invalid user");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(403).send("Incorrect password");
    }
    await createLoginTokens(res, user._id);
    return res.status(200).send({ isLogged: true, isVerified: user.verified });
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function register(req: Request, res: Response) {
  try {
    const {
      username,
      password,
      email,
    }: { username: string; password: string; email: string } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send("Invalid form data");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (user) {
      if (user.email === email) {
        return res.status(409).send("email");
      } else {
        return res.status(409).send("username");
      }
    }
    const passwordHash: string = await hash(password);
    const { code, next_send } = await sendVerificationCode(email);
    if (!code || !next_send) {
      return res.status(500).send("error occured");
    }
    const newData = {
      username,
      email,
      password: passwordHash,
      verifie_code: code,
      start_sending_verify_email: next_send,
    };
    const newUser = await User.create(newData);
    await createLoginTokens(res, newUser._id);
    return res.status(201).send("created");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function logout(req: Request, res: Response) {
  try {
      const { refresh_token } = await getToken(req);
      if (!refresh_token.length) {
        return res.status(307).send("no token");
      }
      const refresh = await decodeRefreshToken(refresh_token);
      if (!refresh || refresh?.expiredAt) {
        return res.status(307).send("token expired");
      }
      const verified = await verifyVersions(refresh);
      if (!verified) {
        return res.status(307).send("token expired");
    }
    await Session.findByIdAndUpdate(refresh.sessionId,{valid:false});

    return res.status(201).send("created");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("user not found");
    }

    const {
      errorSending,
      nextMidnight,
      dailyValidation,
      sendingValidation,
      next_send_time,
      code,
      expire_at,
      daily_mails,
    } = await emailSender(user);
    if (errorSending) {
      logError(`${errorSending}`);
      return res.status(503).send("error sending email");
    }
    if (!sendingValidation) {
      return res.status(429).send(user.reset_code.next_send_time);
    }
    if (!dailyValidation) {
      return res.status(429).send(nextMidnight);
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          "reset_code.code": code,
          "reset_code.logged_times": 0,
          "reset_code.expire_at": expire_at,
          "reset_code.daily_mails": daily_mails,
          "reset_code.next_send_time": next_send_time,
        },
      }
    );
    return res.status(200).send("email sent");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function setPassword(req: Request, res: Response) {
  try {
    const { password, confpass } = req.body;
    const { userId } = req.params;
    const { code } = req.query;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { dailyValid } = dailyLogged(user.reset_code.logged_times - 1);
    if (!dailyValid) {
      return res.status(429).send("detected spam");
    }
    const codeinNumber = parseInt(code?.toString() || "", 0);
    if (
      codeinNumber !== user.reset_code.code ||
      codeinNumber <= 10000000 ||
      codeinNumber > 100000000
    ) {
      return res.status(403).send("wrong code");
    }
    const expiration = isCodeExpired(user.reset_code?.expire_at);
    if (expiration) {
      return res.status(403).send("code expired");
    }
    if (password !== confpass) {
      return res.status(400).send("password mismatch");
    }
    const passwordHash: string = await hash(password);
    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: passwordHash,
        },
      }
    );
    return res.status(204).send("password changed");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function verifyResetAccess(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { daily, dailyValid } = dailyLogged(user.reset_code?.logged_times);
    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          "reset_code.logged_times": daily,
        },
      }
    );
    if (!dailyValid) {
      if (daily === 4) {
        const { next_send_time } = setDailyExpires(
          user.reset_code?.next_send_time
        );
        await User.updateOne(
          {
            _id: user._id,
          },
          {
            $set: {
              "reset_code.next_send_time": next_send_time,
            },
          }
        );
        return res.status(429).send(next_send_time);
      }
      return res.status(429).send(user.reset_code.next_send_time);
    }
    return res.status(200).send({ daily, dailyValid });
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function getAuth(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("false");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const isVerified = user.verified;
    return res.status(200).send({ Logged: true, isVerified });
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function refreshAuth(req: Request, res: Response) {
  try {
    const { refresh_token } = await getToken(req);
    if (!refresh_token.length) {
      return res.status(307).send("no token");
    }
    const refresh = await decodeRefreshToken(refresh_token);
    if (!refresh || refresh?.expiredAt) {
      return res.status(307).send("token expired");
    }
    const verified = await verifyVersions(refresh);
    if (!verified) {
      return res.status(307).send("token expired");
    }
    await refreshTokens(res, refresh);
    return res.status(200).send("request ok");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function verifyUser(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("expired token");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { code } = req.body;
    const codeInt = parseInt(code);
    if (!codeInt || !(codeInt < 100000000 && codeInt >= 10000000)) {
      return res.status(400).send("bad request");
    }
    if (codeInt !== parseInt(user.verifie_code)) {
      return res.status(400).send("bad request");
    }
    user.verified = true;
    user.verified_at = new Date();
    await user.save();
    return res.status(200).send("request ok");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}

export async function resendEmail(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("expired token");
    }
    const access = await decodeAccessToken(access_token);
    const isExpiredToken = verifyExpires(access.exp);
    if (isExpiredToken) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { next_send } = isExpired(user.start_sending_verify_email);
    if (!next_send) {
      return res.status(429).send(user.start_sending_verify_email);
    }
    const { code, next_send: sendValidation } = await sendVerificationCode(
      user.email
    );
    if (!code || !sendValidation) {
      return res.status(500).send("error occured");
    }

    user.verifie_code = code;
    user.start_sending_verify_email = sendValidation;
    await user.save();
    return res.status(200).send("request ok");
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}
