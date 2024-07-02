import express from 'express';

import protectRoute from '../middlewares/protectRoute.js';
import { deleteNotification, getNotifications } from '../controllers/notificationController.js';

const router = express.Router();

router.use(protectRoute);
router.get('/', getNotifications);
router.delete('/', deleteNotification);

export default router;
