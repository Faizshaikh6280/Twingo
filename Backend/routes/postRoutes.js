import express from 'express';

import protectRoute from '../middlewares/protectRoute.js';
import {
  commentPost,
  createPost,
  deletePost,
  getAllPost,
  getFollowingPost,
  getLikedPostByUser,
  getUserPosts,
  likeOrUnlikePost,
} from '../controllers/postController.js';

const router = express.Router();

router.use(protectRoute);

router.get('/all', getAllPost);
router.get('/following', getFollowingPost);
router.post('/create', createPost);
router.post('/user/:username', getUserPosts);
router.get('/liked-post/:id', getLikedPostByUser);
router.post('/like/:id', likeOrUnlikePost);
router.post('/comment/:id', commentPost);
router.delete('/:id', deletePost);

export default router;
