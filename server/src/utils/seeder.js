import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

// ── Sample data ───────────────────────────────────────────────────
const products = [
  {
    name: 'Nike Phantom GX Elite FG',
    price: 5990000,
    originalPrice: 7490000,
    description:
      'Giày bóng đá đỉnh cao với công nghệ Ghost Lace và đế ACC tích hợp. Kiểm soát bóng hoàn hảo trong mọi điều kiện thời tiết.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/phantom-gx-elite-fg-soccer-cleat.png',
    ],
    tier: 'Elite',
    surfaceType: 'FG',
    category: 'Phantom',
    sizes: [
      { size: 39, stock: 5 },
      { size: 40, stock: 8 },
      { size: 41, stock: 12 },
      { size: 42, stock: 10 },
      { size: 43, stock: 7 },
      { size: 44, stock: 4 },
    ],
    isFeatured: true,
    color: 'Đen / Xanh Neon',
    colorHex: '#000000',
    tags: ['bestseller', 'new'],
    rating: 4.8,
    numReviews: 124,
  },
  {
    name: 'Nike Mercurial Vapor 16 Elite FG',
    price: 6490000,
    originalPrice: 7990000,
    description:
      'Siêu phẩm tốc độ với Flyknit Ultra giúp ôm chân tuyệt đối. Đế Aerotrak mang lại lực bám tối đa cho những pha chạy nước rút.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/mercurial-vapor-16-elite-fg.png',
    ],
    tier: 'Elite',
    surfaceType: 'FG',
    category: 'Mercurial',
    sizes: [
      { size: 39, stock: 3 },
      { size: 40, stock: 6 },
      { size: 41, stock: 9 },
      { size: 42, stock: 8 },
      { size: 43, stock: 5 },
      { size: 44, stock: 2 },
    ],
    isFeatured: true,
    color: 'Đỏ Crimson / Vàng',
    colorHex: '#DC143C',
    tags: ['new', 'limited'],
    rating: 4.9,
    numReviews: 87,
  },
  {
    name: 'Nike Tiempo Legend 10 Elite FG',
    price: 5490000,
    description:
      'Kế thừa truyền thống da mềm huyền thoại. Cảm giác chạm bóng cổ điển với độ bền hiện đại. Phù hợp cho tiền vệ và hậu vệ.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/tiempo-legend-10-elite-fg.png',
    ],
    tier: 'Elite',
    surfaceType: 'FG',
    category: 'Tiempo',
    sizes: [
      { size: 39, stock: 6 },
      { size: 40, stock: 9 },
      { size: 41, stock: 14 },
      { size: 42, stock: 11 },
      { size: 43, stock: 8 },
      { size: 44, stock: 5 },
    ],
    isFeatured: true,
    color: 'Nâu Đất / Vàng',
    colorHex: '#8B4513',
    rating: 4.7,
    numReviews: 203,
  },
  {
    name: 'Nike Phantom GX Pro AG',
    price: 3990000,
    originalPrice: 4490000,
    description:
      'Phiên bản Pro cho sân nhân tạo cao cấp (AG). Đế 12 đinh dài + 24 đinh ngắn tối ưu cho sân cỏ nhân tạo hiện đại.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/phantom-gx-pro-ag.png',
    ],
    tier: 'Pro',
    surfaceType: 'AG',
    category: 'Phantom',
    sizes: [
      { size: 39, stock: 10 },
      { size: 40, stock: 15 },
      { size: 41, stock: 20 },
      { size: 42, stock: 18 },
      { size: 43, stock: 12 },
      { size: 44, stock: 8 },
    ],
    isFeatured: true,
    color: 'Xanh Dương / Trắng',
    colorHex: '#003087',
    tags: ['bestseller'],
    rating: 4.6,
    numReviews: 156,
  },
  {
    name: 'Nike Mercurial Superfly 10 Pro TF',
    price: 2990000,
    description:
      'Giày sân cứng TF với đế cao su đa đinh. Phù hợp sân futsal ngoài trời và sân bê tông. Nhẹ, bám, tốc độ.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/mercurial-superfly-10-pro-tf.png',
    ],
    tier: 'Pro',
    surfaceType: 'TF',
    category: 'Mercurial',
    sizes: [
      { size: 38, stock: 8 },
      { size: 39, stock: 12 },
      { size: 40, stock: 16 },
      { size: 41, stock: 20 },
      { size: 42, stock: 15 },
      { size: 43, stock: 10 },
    ],
    isFeatured: false,
    color: 'Xanh Teal / Đen',
    colorHex: '#008080',
    rating: 4.5,
    numReviews: 89,
  },
  {
    name: 'Nike Tiempo Legend 10 Academy FG',
    price: 1990000,
    description:
      'Lựa chọn lý tưởng cho người mới và cầu thủ phong trào. Da tổng hợp bền bỉ, đế FG/MG linh hoạt nhiều loại sân.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/tiempo-legend-10-academy-fg.png',
    ],
    tier: 'Academy',
    surfaceType: 'FG',
    category: 'Tiempo',
    sizes: [
      { size: 36, stock: 10 },
      { size: 37, stock: 12 },
      { size: 38, stock: 15 },
      { size: 39, stock: 20 },
      { size: 40, stock: 18 },
      { size: 41, stock: 14 },
      { size: 42, stock: 10 },
      { size: 43, stock: 6 },
    ],
    isFeatured: false,
    color: 'Đen / Trắng',
    colorHex: '#1a1a1a',
    tags: ['bestseller'],
    rating: 4.4,
    numReviews: 312,
  },
  {
    name: 'Nike Phantom GX Academy TF',
    price: 1590000,
    description:
      'Phiên bản Academy của Phantom GX cho sân TF. Đế cao su đinh ngắn, hoàn hảo cho học sinh sinh viên tập luyện hàng ngày.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/phantom-gx-academy-tf.png',
    ],
    tier: 'Academy',
    surfaceType: 'TF',
    category: 'Phantom',
    sizes: [
      { size: 36, stock: 15 },
      { size: 37, stock: 18 },
      { size: 38, stock: 20 },
      { size: 39, stock: 25 },
      { size: 40, stock: 22 },
      { size: 41, stock: 18 },
      { size: 42, stock: 12 },
    ],
    isFeatured: false,
    color: 'Tím / Xanh Neon',
    colorHex: '#6B21A8',
    rating: 4.3,
    numReviews: 178,
  },
  {
    name: 'Nike Mercurial Vapor 16 Pro AG',
    price: 3490000,
    originalPrice: 4290000,
    description:
      'Tốc độ đỉnh cao trên sân AG. 12 đinh dài phân bổ khoa học, bám sân tốt, tránh chấn thương đầu gối.',
    images: [
      'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/mercurial-vapor-16-pro-ag.png',
    ],
    tier: 'Pro',
    surfaceType: 'AG',
    category: 'Mercurial',
    sizes: [
      { size: 39, stock: 7 },
      { size: 40, stock: 11 },
      { size: 41, stock: 14 },
      { size: 42, stock: 12 },
      { size: 43, stock: 9 },
      { size: 44, stock: 5 },
    ],
    isFeatured: true,
    color: 'Cam / Đen',
    colorHex: '#FF4500',
    tags: ['new'],
    rating: 4.7,
    numReviews: 67,
  },
];

const adminUser = {
  name: 'Admin Nike Store',
  email: 'admin@nikestore.vn',
  password: 'admin123456',
  role: 'admin',
};

// ── Run seeder ────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Xoá data cũ
    await Promise.all([Product.deleteMany(), User.deleteMany()]);
    console.log('🗑️  Cleared old data');

    // Tạo admin
    await User.create(adminUser);
    console.log('👤 Admin created → admin@nikestore.vn / admin123456');

    // Tạo products
    await Product.insertMany(products);
    console.log(`👟 Created ${products.length} products`);

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seed();
