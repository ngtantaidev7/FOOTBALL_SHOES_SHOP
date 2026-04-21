import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// ── Xác thực JWT ─────────────────────────────────────────────────
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error('Tài khoản không tồn tại hoặc đã bị vô hiệu hoá.');
  }

  req.user = user;
  next();
});

// ── Phân quyền theo role ─────────────────────────────────────────
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Quyền "${req.user.role}" không được phép thực hiện thao tác này.`,
      );
    }
    next();
  };
