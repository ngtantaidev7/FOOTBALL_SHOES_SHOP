import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// ── Public ────────────────────────────────────────────────────────
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);

// ── Private ───────────────────────────────────────────────────────
router.post('/:id/reviews', protect, addReview);

// ── Admin ─────────────────────────────────────────────────────────
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
