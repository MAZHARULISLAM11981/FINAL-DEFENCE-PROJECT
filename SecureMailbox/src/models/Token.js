import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
});


if (!mongoose.models.Token) {
  mongoose.model('Token', TokenSchema);
}

export default mongoose.models.Token;
