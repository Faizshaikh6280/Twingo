import express from 'express';
import {
  followOrUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  getme,
  updateUserProfile,
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.use(protectRoute);
router.get('/me', getme);
router.get('/suggested', getSuggestedUser);
router.get('/profile/:username', getUserProfile);

router.post('/follow/:id', followOrUnfollowUser);

router.post('/update-profile', updateUserProfile);

export default router;
