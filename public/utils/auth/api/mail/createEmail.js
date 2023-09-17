"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendResetEmail(email, userId, code) {
  return __awaiter(this, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
      service: "Gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });
    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: email,
      subject: "Password Reset",
      text: `this message is very private`,
      html: `<p>Your password reset link: <a href="https://vini-to-do-frontend.vercel.app/resetpassword/${userId}?code=${code}"> reset your password from here</a></p>`,
    };
    try {
      yield transporter.sendMail(mailOptions);
      const error = "";
      return error;
    } catch (error) {
      return error;
    }
  });
}
exports.default = sendResetEmail;
