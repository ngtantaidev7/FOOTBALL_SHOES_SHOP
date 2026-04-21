import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @route  GET /api/products  — Public
// @query  search, tier, surfaceType, category, minPrice, maxPrice,
//         featured, page, limit, sort
export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    tier,
    surfaceType,
    category,
    minPrice,
    maxPrice,
    featured,
    page = 1,
    limit = 12,
    sort = '-createdAt',
  } = req.query;

  const filter = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Filter multi-value: ?tier=Elite,Pro
  if (tier) filter.tier = { $in: tier.split(',') };
  if (surfaceType) filter.surfaceType = { $in: surfaceType.split(',') };
  if (category) filter.category = { $in: category.split(',') };
  if (featured === 'true') filter.isFeatured = true;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);
  const skip = (pageNum - 1) * limitNum;

  // Song song: lấy data + đếm total
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @route  GET /api/products/featured  — Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort('-createdAt')
    .limit(8);
  res.json({ success: true, data: products });
});

// @route  GET /api/products/slug/:slug  — Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate('reviews.user', 'name avatar');
  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm.');
  }
  res.json({ success: true, data: product });
});

// @route  GET /api/products/:id  — Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'reviews.user',
    'name avatar',
  );
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm.');
  }
  res.json({ success: true, data: product });
});

// @route  GET /api/products/:id/related  — Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm.');
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isActive: true,
  })
    .limit(4)
    .select('name price originalPrice images slug tier surfaceType rating');

  res.json({ success: true, data: related });
});

// @route  POST /api/products  — Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @route  PUT /api/products/:id  — Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm.');
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: updated });
});

// @route  DELETE /api/products/:id  — Private/Admin (soft delete)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm.');
  }

  product.isActive = false;
  await product.save();
  res.json({ success: true, message: 'Đã xoá sản phẩm.' });
});

// @route  POST /api/products/:id/reviews  — Private
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Vui lòng nhập đánh giá và bình luận.');
  }

  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm.');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Bạn đã đánh giá sản phẩm này rồi.');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.numReviews = product.reviews.length;
  product.rating = +(
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length
  ).toFixed(1);

  await product.save();
  res.status(201).json({ success: true, message: 'Đánh giá đã được thêm.' });
});
