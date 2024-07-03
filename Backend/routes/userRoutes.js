import express from 'express';
import {
  followOrUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  getme,
  updatePassword,
  updateUserProfile,
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.use(protectRoute);
router.get('/me', getme);
router.get('/suggested', getSuggestedUser);
router.get('/profile:/username', getUserProfile);

router.post('/follow/:id', followOrUnfollowUser);

router.patch('/update-profile', updateUserProfile);
router.patch('/update-password', updatePassword);

export default router;
