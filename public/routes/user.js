"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.route("/login").post(userController_1.login);
userRouter.route("/logout").get(userController_1.logout);
userRouter.route("/register").post(userController_1.register);
userRouter.route("/resetpassword").post(userController_1.resetPassword);
userRouter
    .route("/resetpassword/:userId")
    .get(userController_1.verifyResetAccess)
    .put(userController_1.setPassword);
userRouter.route("/auth").get(userController_1.getAuth);
userRouter.route("/refresh").get(userController_1.refreshAuth);
userRouter.route("/verifyemail").post(userController_1.verifyUser);
userRouter.route("/resendmail").get(userController_1.resendEmail);
exports.default = userRouter;
