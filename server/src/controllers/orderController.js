import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// @route  POST /api/orders  — Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingInfo, paymentMethod = 'cod', note = '' } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Giỏ hàng trống.');
  }
  if (
    !shippingInfo?.fullName ||
    !shippingInfo?.phone ||
    !shippingInfo?.street
  ) {
    res.status(400);
    throw new Error('Vui lòng nhập đầy đủ thông tin giao hàng.');
  }

  // ── Validate stock + lấy giá từ DB ───────────────────────────
  let itemsPrice = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Sản phẩm không tồn tại hoặc đã ngừng bán.');
    }

    const sizeEntry = product.sizes.find((s) => s.size === Number(item.size));
    if (!sizeEntry) {
      res.status(400);
      throw new Error(`"${product.name}" không có size ${item.size}.`);
    }
    if (sizeEntry.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `"${product.name}" size ${item.size} chỉ còn ${sizeEntry.stock} đôi.`,
      );
    }

    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price, // luôn lấy từ DB
      size: Number(item.size),
      quantity: Number(item.quantity),
    });
    itemsPrice += product.price * item.quantity;
  }

  // Miễn ship khi đơn >= 1.500.000đ
  const shippingPrice = itemsPrice >= 1_500_000 ? 0 : 30_000;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: validatedItems,
    shippingInfo,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    note,
  });

  // ── Trừ stock ─────────────────────────────────────────────────
  for (const item of validatedItems) {
    await Product.updateOne(
      { _id: item.product, 'sizes.size': item.size },
      { $inc: { 'sizes.$.stock': -item.quantity, totalStock: -item.quantity } },
    );
  }

  // ── Gửi email thông báo đơn hàng ──────────────────────────────
  try {
    const formatCurrency = (amount) => amount.toLocaleString('vi-VN') + 'đ';
    const itemsHtml = validatedItems.map(
      (item) =>
        `<li>${item.name} - Size: ${item.size} - Số lượng: ${item.quantity} - Giá: ${formatCurrency(item.price)}</li>`
    ).join('');

    const html = `
      <h2>Cảm ơn bạn đã đặt hàng tại Nike Football Shop!</h2>
      <p>Xin chào <strong>${req.user.name}</strong>,</p>
      <p>Đơn hàng <strong>#${order._id}</strong> của bạn đã được tiếp nhận thành công.</p>
      <h3>Chi tiết đơn hàng:</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Phí giao hàng:</strong> ${formatCurrency(shippingPrice)}</p>
      <p><strong>Tổng cộng:</strong> <span style="color:red; font-weight:bold;">${formatCurrency(totalPrice)}</span></p>
      <h3>Thông tin giao hàng:</h3>
      <p>Họ tên người nhận: ${shippingInfo.fullName}</p>
      <p>Số điện thoại: ${shippingInfo.phone}</p>
      <p>Địa chỉ: ${shippingInfo.street}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}</p>
      <p>Phương thức thanh toán: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản / Online'}</p>
      <br />
      <p>Chúng tôi sẽ đóng gói và giao hàng trong thời gian sớm nhất. Chúc bạn một ngày tốt lành!</p>
    `;

    sendEmail({
      email: req.user.email,
      subject: `Xác nhận đơn hàng #${order._id} - Nike Football Shop`,
      html,
    }).catch((error) => console.error('Lỗi khi gửi email:', error));
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý email:', error);
  }

  res.status(201).json({ success: true, data: order });
});

// @route  GET /api/orders/my  — Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .select('-__v');
  res.json({ success: true, data: orders });
});

// @route  GET /api/orders/:id  — Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email',
  );
  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng.');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Bạn không có quyền xem đơn hàng này.');
  }
  res.json({ success: true, data: order });
});

// @route  GET /api/orders  — Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, orderStatus } = req.query;

  const filter = orderStatus ? { orderStatus } : {};
  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);

  const [orders, total, revenueResult] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(filter),
    Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
  ]);

  res.json({
    success: true,
    data: orders,
    totalRevenue: revenueResult[0]?.total ?? 0,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @route  PUT /api/orders/:id/status  — Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const validStatuses = [
    'pending',
    'confirmed',
    'shipping',
    'delivered',
    'cancelled',
  ];
  if (orderStatus && !validStatuses.includes(orderStatus)) {
    res.status(400);
    throw new Error('Trạng thái đơn hàng không hợp lệ.');
  }

  // Hoàn stock nếu huỷ đơn
  if (orderStatus === 'cancelled') {
    const order = await Order.findById(req.params.id);
    if (order && order.orderStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'sizes.size': item.size },
          {
            $inc: { 'sizes.$.stock': item.quantity, totalStock: item.quantity },
          },
        );
      }
    }
  }

  const update = {
    ...(orderStatus && { orderStatus }),
    ...(paymentStatus && { paymentStatus }),
    ...(orderStatus === 'delivered' && { deliveredAt: new Date() }),
  };

  const order = await Order.findByIdAndUpdate(req.params.id, update, {
    new: true,
  }).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng.');
  }

  res.json({ success: true, data: order });
});

// @route  GET /api/orders/stats  — Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    revenueDay,
    revenueMonth,
    revenueYear,
    totalOrders,
    totalCustomers,
    recentOrders,
  ] = await Promise.all([
    // Doanh thu ngày
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    // Doanh thu tháng
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    // Doanh thu năm
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
          orderStatus: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name'),
  ]);

  res.json({
    success: true,
    data: {
      revenue: {
        day: revenueDay[0]?.total || 0,
        month: revenueMonth[0]?.total || 0,
        year: revenueYear[0]?.total || 0,
      },
      orders: {
        total: totalOrders,
      },
      customers: totalCustomers,
      recentOrders: recentOrders.map((o) => ({
        id: o._id,
        customer: o.user?.name || o.shippingInfo.fullName,
        total: o.totalPrice,
        status: o.orderStatus,
        date: o.createdAt,
        items: o.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingInfo: o.shippingInfo,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus
      })),
    },
  });
});

// @route  GET /api/orders/insights  — Private/Admin
export const getCustomerInsights = asyncHandler(async (req, res) => {
  const insights = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' },
        lastOrder: { $max: '$createdAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    { $unwind: '$userInfo' },
    {
      $project: {
        _id: 1,
        orderCount: 1,
        totalSpent: 1,
        lastOrder: 1,
        name: '$userInfo.name',
        email: '$userInfo.email',
        avatar: '$userInfo.avatar',
        role: '$userInfo.role',
      },
    },
    { $sort: { totalSpent: -1 } },
  ]);
  res.json({ success: true, data: insights });
});

// @route  GET /api/orders/reports/detailed  — Private/Admin
export const getDetailedReports = asyncHandler(async (req, res) => {
  // Top products
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        image: { $first: '$items.image' },
        totalQty: { $sum: '$items.quantity' },
        totalRevenue: {
          $sum: { $multiply: ['$items.price', '$items.quantity'] },
        },
      },
    },
    { $sort: { totalQty: -1 } },
    { $limit: 10 },
  ]);

  // Sales by day for the last 30 days
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const salesByDay = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: last30Days },
        orderStatus: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: { topProducts, salesByDay } });
});
// @route  PUT /api/orders/:id/cancel  — Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng.');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Bạn không có quyền hủy đơn hàng này.');
  }

  if (order.orderStatus !== 'pending') {
    res.status(400);
    throw new Error('Chỉ có thể hủy đơn hàng khi đang ở trạng thái "Chờ xác nhận".');
  }

  // Hoàn stock
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product, 'sizes.size': item.size },
      {
        $inc: { 'sizes.$.stock': item.quantity, totalStock: item.quantity },
      },
    );
  }

  order.orderStatus = 'cancelled';
  await order.save();

  res.json({ success: true, message: 'Đã hủy đơn hàng thành công.' });
});
