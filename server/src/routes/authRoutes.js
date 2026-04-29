import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  getMe,
  updateMe,
  changePassword,
  toggleWishlist,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);

// Private
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);

// Admin
router.get('/admin/users', protect, authorize('admin'), getAllUsers);

export default router;
