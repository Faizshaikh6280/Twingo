import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import userModel from "../models/userModel.js";
import AppError from "../utils/AppError.js";

const signinToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });

const createTokenAndSend = function (user, res, statusCode) {
  const token = signinToken(user._id);

  res.cookie("jwt", token, {
    maxAge: process.env.JWT_EXPIRES_TIME_COOKIE * 24 * 60 * 60 * 1000, // Expires after 15 minutes
    httpOnly: true, // Cookie accessible only via HTTP(S)
    secure: process.env.NODE_ENV !== "development", // Cookie only sent over HTTPS
  });

  res.status(statusCode).json({
    status: "success",
    token: process.env.NODE_ENV === "development" ? token : undefined,
    user,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { fullname, username, password, email } = req.body;

  const newUser = await userModel.create({
    fullname,
    username,
    password,
    email,
  });

  createTokenAndSend(newUser, res, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await userModel
    .findOne({
      username,
    })
    .select("+password");

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError("Username or password is invalid!", 400));

  createTokenAndSend(user, res, 200);
});

export const logout = async (req, res, next) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });

  res.status(200).json({
    status: "success",
    message: "Logout successfully!",
  });
};
