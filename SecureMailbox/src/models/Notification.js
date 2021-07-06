import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  createAt: {
    type: Date,
  },
});


if (!mongoose.models.Notification) {
  mongoose.model('Notification', NotificationSchema);
}

export default mongoose.models.Notification;
