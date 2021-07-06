import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    default: 'User'
  },
  status: {
    type: Boolean,
    default: false,
  },
  answer: {
    type: String,
  },
  createAt: {
    type: Date,
  },
});

// Query middleware
// UserSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'role',
//     select: '',
//   });
//   next();
// });

// UserSchema.pre('save', async function(next) {
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

UserSchema.methods.hashPassword = async function(password) {
  return await bcrypt.hash(password, 12);
};

UserSchema.methods.verifyPassword = async function(
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

if (!mongoose.models.User) {
  mongoose.model('User', UserSchema);
}

export default mongoose.models.User;
