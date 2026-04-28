import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// ── Helpers ───────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

const sanitizeUser = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  token,
});

// @route  POST /api/auth/register  — Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Vui lòng nhập đủ họ tên, email và mật khẩu.');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email này đã được đăng ký.');
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  res.status(201).json({ success: true, data: sanitizeUser(user, token) });
});

// @route  POST /api/auth/login  — Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Vui lòng nhập email và mật khẩu.');
  }

  // select('+password') vì schema đặt select: false
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không đúng.');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error(
      'Tài khoản đã bị vô hiệu hoá. Liên hệ admin để được hỗ trợ.',
    );
  }

  res.json({ success: true, data: sanitizeUser(user, signToken(user._id)) });
});

// @route  POST /api/auth/google-login  — Public
export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, avatar } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email là bắt buộc.');
  }

  // Tìm user theo email, nếu chưa có thì tạo mới
  let user = await User.findOne({ email });

  if (!user) {
    // Tạo mật khẩu ngẫu nhiên cho user Google (họ không cần dùng)
    const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: randomPassword,
      avatar: avatar || '',
    });
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Tài khoản đã bị vô hiệu hoá.');
  }

  res.json({ success: true, data: sanitizeUser(user, signToken(user._id)) });
});

// @route  GET /api/auth/me  — Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name images price slug tier surfaceType',
  );
  res.json({ success: true, data: user });
});

// @route  PUT /api/auth/me  — Private
export const updateMe = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  );
  res.json({ success: true, data: user });
});

// @route  PUT /api/auth/change-password  — Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.');
  }
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Mật khẩu hiện tại không đúng.');
  }

  user.password = newPassword;
  await user.save(); // pre-save hook tự hash lại

  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công.',
    token: signToken(user._id),
  });
});

// @route  POST /api/auth/wishlist/:productId  — Private (toggle)
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const idx = user.wishlist.map(String).indexOf(productId);

  let wishlisted;
  if (idx === -1) {
    user.wishlist.push(productId);
    wishlisted = true;
  } else {
    user.wishlist.splice(idx, 1);
    wishlisted = false;
  }

  await user.save();
  res.json({ success: true, wishlisted, wishlist: user.wishlist });
});
