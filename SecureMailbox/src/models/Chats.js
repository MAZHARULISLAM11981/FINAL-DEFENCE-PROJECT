import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  createAt: {
    type: Date,
  },
});


if (!mongoose.models.Chat) {
  mongoose.model('Chat', ChatSchema);
}

export default mongoose.models.Chat;
