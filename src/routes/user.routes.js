import { Router } from "express";
import {
  ForgetPassword,
  LoginUser,
  LogoutUser,
  RegisterUser,
  ResetPassword,
  UpdatePassword,
  VerifyOtp,
} from "../controllers/user.controller.js";
import IsUserLoggedIn from "../middleware/auth.middleware.js";

const userRouter = Router();

// Register user
userRouter.post("/register", RegisterUser);

// Login User
userRouter.post("/", LoginUser);

// Update Password
userRouter.put("/update", IsUserLoggedIn, UpdatePassword);

// Reset Password
userRouter.post("/forget-password", IsUserLoggedIn, ForgetPassword);

//Verify Otp
userRouter.post("/verify-otp", IsUserLoggedIn, VerifyOtp);

//Forget Password
userRouter.post("/forget", IsUserLoggedIn, ResetPassword);

// logot User
userRouter.post("/logout", IsUserLoggedIn, LogoutUser);

export default userRouter;
