import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import userModel from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

const protectRoute = catchAsync(async (req, res, next) => {
  // get token from cookie
  const token = req.cookies.jwt;
  // check is token valid or not
  if (!token) return next(new AppError("Please login to get access", 400));
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  // find user with id
  const user = await userModel.findOne({ _id: decode.id });
  // if not user token is changed hence invalid!
  if (!user) return next(new AppError("Invalid Token!", 400));
  req.user = user;
  next();
});

export default protectRoute;
