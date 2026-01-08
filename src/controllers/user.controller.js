import {
  AuthValidation,
  Loginvalidate,
} from "../utils/auth_validate/auth_validate.js";
import ApiResponse from "../utils/api_response/api_response.js";
import { UserModel } from "../models/user.model.js";
import { Op } from "sequelize";
import ApiError from "../utils/api_response/api_error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Resend } from "resend";
import {
  GenerateToken,
  OtpEmailTemplate,
} from "../utils/helper_methods/helper.js";

const RegisterUser = async (req, res) => {
  try {
    const validateUser = AuthValidation(req.body);

    if (!validateUser.valid) {
      const response = new ApiResponse(400, validateUser.message);
      return res.status(response.statusCode).json(response);
    }

    const { name, username, email, password } = req.body;

    const existUser = await UserModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existUser) {
      const response = new ApiResponse(409, "User already Exist");
      return res.status(response.statusCode).json(response);
    }

    const createUser = await UserModel.create({
      name,
      username,
      email,
      password,
    });

    const { password: _, ...reamining } = createUser.toJSON();

    const response = new ApiResponse(
      201,
      "User created successfully",
      reamining
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `Failed to create User: ${error.message}`);
  }
};

// login user
const LoginUser = async (req, res) => {
  const validate = Loginvalidate(req.body);

  if (!validate.valid) {
    const response = new ApiResponse(400, validate.message);
    return res.status(response.statusCode).json(response);
  }

  try {
    const { identifier, password } = req.body;

    const existUser = await UserModel.findOne({
      where: { [Op.or]: [{ email: identifier }, { username: identifier }] },
    });

    if (!existUser) {
      const response = new ApiResponse(404, "user not found");
      return res.status(response.statusCode).json(response);
    }

    const passwordValidate = await bcrypt.compare(password, existUser.password);

    if (!passwordValidate) {
      const response = new ApiResponse(404, "incorrect password");
      return res.status(response.statusCode).json(response);
    }

    const token = await jwt.sign({ id: existUser.id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    const { password: _, ...remaining } = existUser.toJSON();

    remaining.token = token;
    const response = new ApiResponse(200, "Logged in successfully", remaining);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `Failed to login user: ${error.message}`);
  }
};

// Update password logic
const UpdatePassword = async (req, res) => {
  try {
    const id = req.user.id;

    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }

    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword || newPassword)) {
      const response = new ApiResponse(400, "old and new password is required");
      return res.status(response.statusCode).json(response);
    }

    if (newPassword.length < 6) {
      const response = new ApiResponse(
        400,
        "New Password must be at least 6 characters"
      );
      return res.status(response.statusCode).json(response);
    }

    const findUser = await UserModel.findByPk(id);
    if (!findUser) {
      const response = new ApiResponse(404, "user can't found");
      return res.status(response.statusCode).json(response);
    }

    const match = await bcrypt.compare(oldPassword, findUser.password);
    if (!match) {
      const response = new ApiResponse(404, "incorrect password");
      return res.status(response.statusCode).json(response);
    }

    await UserModel.update(
      { password: newPassword },
      { where: { id: findUser.id }, individualHooks: true }
    );
    const response = new ApiResponse(200, "Password updated successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `failed to update Password: ${error.message}`);
  }
};

// forget password
const ForgetPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res
        .status(400)
        .json(new ApiResponse(400, "username or email is required"));
    }

    const findUser = await UserModel.findOne({
      where: { [Op.or]: [{ username: identifier }, { email: identifier }] },
    });

    if (!findUser) {
      const response = new ApiResponse(404, "Invalid username or email");
      return res.status(response.statusCode).json(response);
    }

    const resend = new Resend(process.env.RESEND_KEY);

    const otp = GenerateToken();

    const conversionOtp = otp.toString();

    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(conversionOtp, salt);

    const resetToken = crypto.randomBytes(32).toString("hex");

    findUser.resetOtp = hashOtp;
    findUser.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
    findUser.resetToken = resetToken;
    findUser.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    findUser.isOtpVerified = false;

    await findUser.save();

    await resend.emails.send({
      from: "Byte Brief <contact@bytebrief.press>",
      to: [findUser.email],
      subject: "Password Reset OTP",
      html: OtpEmailTemplate(otp, findUser.username),
    });

    const response = new ApiResponse(200, "otp sent successfully", resetToken);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `Failed to forget password: ${error.message}`);
  }
};

// Verify Otp
const VerifyOtp = async (req, res) => {
  try {
    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }
    const { resetToken, otp } = req.body;

    if (!(resetToken || otp)) {
      const response = new ApiResponse(404, "reset token and otp is required");
      return res.status(response.statusCode).json(response);
    }
    const user = await UserModel.findOne({ where: { resetToken } });

    if (!user || !user.resetOtp) {
      const response = new ApiResponse(404, "invalid otp session");
      return res.status(response.statusCode).json(response);
    }

    if (user.resetOtpExpires < new Date()) {
      const response = new ApiResponse(404, "Otp expired");
      return res.status(response.statusCode).json(response);
    }

    const verify = await bcrypt.compare(otp.toString(), user.resetOtp);

    if (!verify) {
      const response = new ApiResponse(404, "invalid otp");
      return res.status(response.statusCode).json(response);
    }

    user.isOtpVerified = true;
    await user.save();

    const response = new ApiResponse(200, "otp verified", user.resetToken);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `failed to verify otp token: ${error.message}`);
  }
};

// reset password
const ResetPassword = async (req, res) => {
  try {
    if (!req.body) {
      const response = new ApiResponse(400, "invalid response");
      return res.status(response.statusCode).json(response);
    }
    const { resetToken, newPassword } = req.body;

    if (!(resetToken || newPassword)) {
      const response = new ApiResponse(
        404,
        "reset token and new password is required"
      );
      return res.status(response.statusCode).json(response);
    }
    const user = await UserModel.findOne({ where: { resetToken } });

    if (!user || !user.resetTokenExpires < new Date()) {
      const response = new ApiResponse(
        403,
        "Reset session expired. Please start over."
      );
      return res.status(response.statusCode).json(response);
    }

    if (!user.isOtpVerified) {
      const response = new ApiResponse(403, "otp not verified.");
      return res.status(response.statusCode).json(response);
    }

    user.password = newPassword;

    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetToken = null;
    user.resetTokenExpires = null;
    user.isOtpVerified = false;

    await user.save();

    const response = new ApiResponse(200, "password reset successfully");
    return res.status(response.statusCode).json(response);
  } catch (error) {
    throw new ApiError(500, `failed to reset password: ${error.message}`);
  }
};

// Logout User
const LogoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  const response = new ApiResponse(200, "logged out successfully");
  return res.status(response.statusCode).json(response);
};

export {
  RegisterUser,
  LoginUser,
  LogoutUser,
  UpdatePassword,
  ForgetPassword,
  VerifyOtp,
  ResetPassword,
};
