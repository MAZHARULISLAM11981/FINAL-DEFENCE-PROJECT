import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  filePath: {
    type: String,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true
  },
  createAt: {
    type: Date,
  },
});


if (!mongoose.models.Email) {
  mongoose.model('Email', EmailSchema);
}

export default mongoose.models.Email;
