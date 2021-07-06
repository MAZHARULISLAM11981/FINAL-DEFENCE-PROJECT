import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  }
});


if (!mongoose.models.Alert) {
  mongoose.model('Alert', AlertSchema);
}

export default mongoose.models.Alert;
