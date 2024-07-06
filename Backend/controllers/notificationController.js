import catchAsync from '../utils/catchAsync.js';
import notificationModel from '../models/notificationModel.js';
export const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const notifications = await notificationModel
    .find({
      $and: [
        {
          to: userId,
        },
        {
          from: { $ne: userId },
        },
      ],
    })
    .populate({
      path: 'from',
      select: 'username profileImg',
    });

  // once notification is read mark them as true
  await notificationModel.updateMany({ to: userId }, { read: true });

  res.status(200).json({
    status: 'success',
    notifications,
  });
});

export const deleteNotification = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  await notificationModel.deleteMany({
    to: userId,
  });

  res.status(200).json({
    status: 'success',
    message: 'Notification deleted succesfully!',
  });
});
