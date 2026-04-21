import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Connect DB ────────────────────────────────────────────────────
connectDB();

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV }),
);

// ── Error Handler (phải đặt cuối cùng) ───────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
