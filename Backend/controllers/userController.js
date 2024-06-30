import userModel from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getme = catchAsync(async (req, res, next) => {
  const logedInId = req.user._id;

  const user = await userModel.findOne({ _id: logedInId });

  res.status(200).json({
    status: "success",
    user,
  });
});
