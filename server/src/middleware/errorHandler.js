// ── 404 Not Found ─────────────────────────────────────────────────
export const notFound = (req, res, next) => {
  const error = new Error(`Route không tồn tại: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ── Global Error Handler ──────────────────────────────────────────
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Mongoose: ObjectId không hợp lệ
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Không tìm thấy tài nguyên.';
  }

  // Mongoose: Duplicate key (email trùng...)
  if (err.code === 11000) {
    statusCode = 400;
    message = `${Object.keys(err.keyValue)[0]} này đã được sử dụng.`;
  }

  // Mongoose: Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // JWT: Token không hợp lệ
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ.';
  }

  // JWT: Token hết hạn
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn. Vui lòng đăng nhập lại.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
