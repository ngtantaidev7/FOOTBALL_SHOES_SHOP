import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Tất cả order routes đều cần đăng nhập
router.use(protect);

// ── Admin ─────────────────────────────────────────────────────────
router.get('/stats', authorize('admin'), getOrderStats);

// ── User ──────────────────────────────────────────────────────────
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

// ── Admin ─────────────────────────────────────────────────────────
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
