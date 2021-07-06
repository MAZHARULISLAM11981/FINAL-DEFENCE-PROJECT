import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User';
import AppError from '../utils/errors/AppError';

const authorizedUser = (async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
     return next(new AppError('Your session has expired. Please login again.', 400));
  }

  // Verification token
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
       return next(new AppError('Your session has expired. Please login again.', 400));
    }
  });

  // Decode token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
     return next(new AppError('Your session has expired. Please login again.', 400));
  }
  
  return next();
});

export default authorizedUser;
