import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  getCustomerInsights,
  getDetailedReports,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Tất cả order routes đều cần đăng nhập
router.use(protect);

// ── Admin Specific (Phải đặt TRÊN :id) ──────────────────────────
router.get('/stats', authorize('admin'), getOrderStats);
router.get('/admin/insights', authorize('admin'), getCustomerInsights);
router.get('/admin/reports/detailed', authorize('admin'), getDetailedReports);
router.get('/', authorize('admin'), getAllOrders);

// ── User / Common ──────────────────────────────────────────────────
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.put('/:id/cancel', cancelOrder);
router.get('/:id', getOrderById);

// ── Admin Actions ──────────────────────────────────────────────────
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
