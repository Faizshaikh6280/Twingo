import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import notificationModel from '../models/notificationModel.js';
import { v2 as clodinary } from 'cloudinary';

export const getme = catchAsync(async (req, res, next) => {
  const logedInId = req.user._id;

  const user = await userModel.findOne({ _id: logedInId });

  res.status(200).json({
    status: 'success',
    user,
  });
});

export const getSuggestedUser = catchAsync(async (req, res, next) => {
  const currentUser = await userModel.findOne({ _id: req.user._id }).select('following');
  // Total 6 users will be suggested
  // //- 2 Random users will be from the follwers of currentUser.
  // const followersUser = await userModel.aggregate([
  //   {
  //     // get the current user
  //     $match: {
  //       _id: req.user._id,
  //     },
  //   },
  //   // unwind the followers array
  //   {
  //     $unwind: '$followers',
  //   },
  //   //Looking to get the full details of follwers array
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: 'followers',
  //       foreignField: '_id',
  //       as: 'followerDetails',
  //     },
  //   },
  //   //unwind the resulting array from lookup
  //   {
  //     $unwind: '$followerDetails',
  //   },
  //   // get 2 random users
  //   {
  //     $sample: { size: 2 },
  //   },
  //   // Project the desired fields
  //   {
  //     $project: {
  //       _id: '$followerDetails._id',
  //       fullname: '$followerDetails.fullname',
  //       username: '$followerDetails.username',
  //       profilePic: '$followerDetails.profilePic',
  //     },
  //   },
  //   {
  //     $addFields: {
  //       status: 'followers',
  //     },
  //   },
  // ]);
  //- 2 users will be from random user that user does not follows
  currentUser.following.push(currentUser._id);
  let randomUser = await userModel.aggregate([
    {
      $match: {
        _id: { $nin: currentUser.following },
      },
    },
    // Get 2 random users
    {
      $sample: { size: 10 },
    },
    // Project the desired fields
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        profileImg: 1,
      },
    },
  ]);

  // randomUser = randomUser.filter((el) => !el._id.equals(currentUser._id));

  // //- 2 users will be from following of current user following. (make sure current user does not follow those)
  // const followingOfFollowing = await userModel.aggregate([
  //   {
  //     $match: {
  //       _id: { $ne: currentUser._id },
  //       _id: { $nin: followersUser },
  //       _id: { $nin: randomUser },
  //       _id: { $in: currentUser.following },
  //     },
  //   },
  //   {
  //     $unwind: '$following',
  //   },
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: 'following',
  //       foreignField: '_id',
  //       as: 'followingDetails',
  //     },
  //   },
  //   {
  //     $unwind: '$followingDetails',
  //   },
  //   {
  //     $match: {
  //       'followingDetails._id': { $ne: currentUser._id },
  //       'followingDetails._id': { $nin: currentUser.following },
  //     },
  //   },
  //   {
  //     $sample: { size: 2 },
  //   },
  //   {
  //     $project: {
  //       _id: '$followingDetails._id',
  //       fullname: '$followingDetails.fullname',
  //       username: '$followingDetails.username',
  //       profilePic: '$followingDetails.profilePic',
  //     },
  //   },
  //   {
  //     $addFields: {
  //       status: 'followingOfFollowing',
  //     },
  //   },
  // ]);

  res.status(200).json({
    status: 'success',
    length: randomUser.length,
    suggestedUsers: randomUser,
  });
});

export const followOrUnfollowUser = catchAsync(async (req, res, next) => {
  if (req.user._id.toString() === req.params.id) {
    return next(new AppError('User cannot follow/unfollow himself!', 400));
  }

  const currentUser = await userModel.findOne({ _id: req.user._id });
  const userToModify = await userModel.findOne({ _id: req.params.id });

  if (!userToModify || !currentUser) {
    return next(new AppError('User not found', 404));
  }

  const isFollowing = currentUser.following.includes(req.params.id);

  // currentUser already follwing hence - Unfollow here
  if (isFollowing) {
    // currentUser not follwing hence - Follow here
    await userModel.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user._id },
    });
    await userModel.findByIdAndUpdate(req.user._id, {
      $pull: { following: req.params.id },
    });
    res.status(200).json({
      status: 'success',
      message: `${currentUser.fullname} unfollowed  ${userToModify.fullname} successfuly!`,
    });
  } else {
    // currentUser not follwing hence - Follow here
    await userModel.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user._id },
    });
    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { following: req.params.id },
    });
    //  send notification about the follow
    await notificationModel.create({
      from: currentUser._id,
      to: userToModify._id,
      type: 'follow',
    });

    res.status(200).json({
      status: 'success',
      message: `${currentUser.fullname} followed ${userToModify.fullname} successfuly!`,
    });
  }
});

export const getUserProfile = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({ username: req.params.username });

  if (!user) return next(new AppError('Username does not exists', 404));

  res.status(200).json({
    status: 'success',
    user,
  });
});
export const updateUserProfile = catchAsync(async (req, res, next) => {
  const { newPassword, currentPassword } = req.body;

  const user = await userModel.findOne({ _id: req.user._id }).select('+password');

  if (!user) return next(new AppError('User not found!', 400));

  // Password Checks here..
  if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
    return next(new AppError('Please provide both new Password and current password', 400));
  }

  // means both password given or none of them
  if (newPassword && currentPassword) {
    const isMatch = await user.comparePassword(currentPassword, user.password);
    if (!isMatch) return next(new AppError('Current password is incorrect', 400));
    if (newPassword.length < 6)
      return next(new AppError('New password must be atleast 6 characters long.'));
  }

  const { fullname, username, email, bio, link } = req.body;
  let { profileImg, coverImg } = req.body;

  if (!user) return next(new AppError('User not found!', 400));

  if (profileImg) {
    // deleting previous image
    if (user.profileImg) {
      await clodinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
    }

    const uploadedProfile = await clodinary.uploader.upload(profileImg);
    profileImg = uploadedProfile.secure_url;
  }

  if (coverImg) {
    if (user.coverImg) {
      await clodinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
    }
    const uploadedCoverimg = await clodinary.uploader.upload(coverImg);
    coverImg = uploadedCoverimg.secure_url;
  }

  user.password = newPassword || user.password;
  user.fullname = fullname || user.fullname;
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;

  await user.save();

  res.status(200).json({
    status: 'success',
    user,
  });
});
