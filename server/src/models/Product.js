import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema(
  {
    size: { type: Number, required: true }, // EU size: 39, 40, 41...
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const specSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g., "Chất liệu Upper"
    value: { type: String, required: true }, // e.g., "Flyknit"
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
      maxlength: [120, 'Tên không quá 120 ký tự'],
    },
    slug: { type: String, unique: true, lowercase: true }, // tự động tạo từ name
    sku: { type: String, unique: true, sparse: true, trim: true }, // Mã sản phẩm enterprise

    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null }, // null = không giảm giá

    description: { type: String, required: true },
    images: {
      type: [String],
      required: true,
      validate: [(a) => a.length > 0, 'Cần ít nhất 1 ảnh'],
    },

    // Phân khúc sản phẩm
    tier: {
      type: String,
      required: true,
      enum: ['Elite', 'Pro', 'Academy', 'Club'],
    },
    // Loại sân
    surfaceType: {
      type: String,
      required: true,
      enum: ['FG', 'AG', 'TF', 'IC', 'SG', 'MG'],
    },
    // Dòng giày
    category: {
      type: String,
      required: true,
      enum: ['Phantom', 'Mercurial', 'Tiempo', 'Vapor', 'Lifestyle', 'Running', 'Gym & Training', 'Other'],
    },

    sizes: { type: [sizeSchema], required: true },
    totalStock: { type: Number, default: 0 }, // tính tự động qua pre-save
    weight: { type: Number, default: null }, // Trọng lượng (gram)

    specs: { type: [specSchema], default: [] }, // Thông số kỹ thuật

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    color: { type: String, default: '' },
    colorHex: { type: String, default: '#000000' },
    tags: [String], // ['new', 'bestseller', 'limited']
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// ── Pre-save: tạo slug + tính totalStock ─────────────────────────
productSchema.pre('save', function () {
  if (this.isModified('name')) {
    // Basic slug generation + append small random string to avoid duplicate errors naturally if name is same
    let baseSlug = this.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    if(!this.slug) {
       this.slug = baseSlug + '-' + Math.random().toString(36).substring(2, 6);
    }
  }

  // Auto generate SKU if empty
  if (!this.sku && this.isNew) {
    this.sku = `NK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  this.totalStock = this.sizes.reduce((sum, s) => sum + s.stock, 0);
});

// ── Virtual: % giảm giá ──────────────────────────────────────────
productSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(
    ((this.originalPrice - this.price) / this.originalPrice) * 100,
  );
});

// ── Index: text search + filter thường dùng ─────────────────────
productSchema.index({ name: 'text', description: 'text', sku: 'text' });
productSchema.index({ tier: 1, surfaceType: 1 });
productSchema.index({ isFeatured: 1 });

export default mongoose.model('Product', productSchema);
