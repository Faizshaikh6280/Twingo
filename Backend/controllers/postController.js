import notificationModel from '../models/notificationModel.js';
import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = catchAsync(async (req, res, next) => {
  let { text, image } = req.body;
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user) return next(new AppError('User not found', 404));
  if (!text && !image) return next(new AppError('Post must have either text or image'));

  if (image) {
    // upload the image
    const uploadedPostImg = await cloudinary.uploader.upload(image);
    image = uploadedPostImg.secure_url;
  }

  const newPost = await postModel.create({
    userId,
    text,
    image,
  });
  res.status(200).json({
    status: 'success',
    newPost,
  });
});

export const deletePost = catchAsync(async (req, res, next) => {
  const post = await postModel.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));

  const isAuthenticated = post.userId.equals(req.user._id);
  if (!isAuthenticated) {
    return next(new AppError("You don't have permission to delete this post", 403));
  }

  if (post.image) {
    const postId = post.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(postId);
  }

  await postModel.findByIdAndDelete(post._id);

  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully!',
  });
});

export const likeOrUnlikePost = catchAsync(async (req, res, next) => {
  const post = await postModel.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));
  const user = await userModel.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 400));
  }

  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    // remove the userid from liked array
    await postModel.findByIdAndUpdate(
      post._id,
      {
        $pull: {
          likes: user._id,
        },
      },
      {
        new: true,
      }
    );
    await userModel.findByIdAndUpdate(user._id, {
      $pull: {
        likedPosts: post._id,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Post unliked successfull!',
    });
  }

  post.likes.push(user._id);
  user.likedPosts.push(post._id);
  await post.save();
  await user.save();

  // notify user about like
  const notificitaion = await notificationModel.create({
    from: user._id,
    to: post.userId,
    type: 'like',
  });

  res.status(200).json({
    status: 'success',
    message: 'Post liked successfull!',
  });
});

export const commentPost = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  const post = await postModel.findById(req.params.id);
  if (!post) return next(new AppError('Post not found', 404));
  const user = await userModel.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 400));
  }

  const comment = { userId: user._id, text };
  post.comments.push(comment);
  await post.save();
  // notify user about comment
  const notificitaion = await notificationModel.create({
    from: user._id,
    to: post.userId,
    type: 'comment',
  });

  res.status(200).json({
    status: 'success',
    message: 'Post commented successfull!',
  });
});

export const getAllPost = catchAsync(async (req, res, next) => {
  const posts = await postModel.find().populate('userId').populate({
    path: 'comments.userId',
  });

  res.status(200).json({
    status: 'success',
    length: posts.length,
    posts,
  });
});

export const getLikedPostByUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await userModel.findById(userId);

  if (!user) return next(new AppError('User not found!', 404));

  const likedPosts = await postModel
    .find({ _id: { $in: user.likedPosts } })
    .populate('userId')
    .populate('comments.userId');

  res.status(200).json({
    status: 'success',
    length: likedPosts.length,
    likedPosts,
  });
});

export const getFollowingPost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const user = await userModel.findById(userId);
  if (!user) return next(new AppError('user not found!', 404));

  const feedPosts = await postModel
    .find({ userId: { $in: user.following } })
    .sort({ createdAt: -1 })
    .populate({
      path: 'userId',
    })
    .populate('comments.userId');

  res.status(200).json({
    status: 'success',
    length: feedPosts.length,
    feedPosts,
  });
});

export const getUserPosts = catchAsync(async (req, res, next) => {
  const username = req.params.username;

  const user = await userModel.findOne({ username });
  if (!user) return next(new AppError('user not found!', 404));

  const posts = await postModel
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: 'userId',
    })
    .populate('comments.userId');

  res.status(200).json({
    status: 'success',
    length: posts.length,
    posts,
  });
});
