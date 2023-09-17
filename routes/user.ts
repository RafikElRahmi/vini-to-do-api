import {
  getAuth,
  login,
  logout,
  refreshAuth,
  register,
  resendEmail,
  resetPassword,
  setPassword,
  verifyResetAccess,
  verifyUser,
} from "@controllers/userController";
import { Router, Request, Response } from "express";
const userRouter = Router();

userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);

userRouter.route("/register").post(register);

userRouter.route("/resetpassword").post(resetPassword);

userRouter
  .route("/resetpassword/:userId")
  .get(verifyResetAccess)
  .put(setPassword);

userRouter.route("/auth").get(getAuth);

userRouter.route("/refresh").get(refreshAuth);

userRouter.route("/verifyemail").post(verifyUser);

userRouter.route("/resendmail").get(resendEmail);

export default userRouter;
