import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SizeSelector from '../components/SizeSelector';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import {
  getProductBySlugAPI,
  getRelatedProductsAPI,
  addReviewAPI,
} from '../services/productService';
import { toggleWishlistAPI } from '../services/authService';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc'); // 'desc' | 'reviews'
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getProductBySlugAPI(slug);
        setProduct(data.data);
        setSize(null);

        const rel = await getRelatedProductsAPI(data.data._id);
        setRelated(rel.data.data);
      } catch {
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (!size) return toast.error('Vui lòng chọn size!');
    addItem({ ...product, selectedSize: size }, qty);
    setShowCartModal(true);
  };

  const handleWishlist = async () => {
    if (!user) return navigate('/auth');
    try {
      await toggleWishlistAPI(product._id);
      toast.success('Đã cập nhật danh sách yêu thích!');
    } catch {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/auth');
    if (!review.comment.trim())
      return toast.error('Vui lòng nhập nội dung đánh giá!');
    setSubmitting(true);
    try {
      await addReviewAPI(product._id, review);
      toast.success('Đánh giá đã được gửi!');
      setReview({ rating: 5, comment: '' });
      const { data } = await getProductBySlugAPI(slug);
      setProduct(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div className='bg-zinc-100 rounded-2xl aspect-square animate-pulse' />
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='bg-zinc-100 rounded h-8 animate-pulse' />
          ))}
        </div>
      </div>
    );

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // Create an array of exactly 5 images for the gallery
  const galleryImages = Array.from({ length: 5 }).map((_, i) => {
    return product.images[i % product.images.length];
  });

  // Standardize sizes from 38 to 45
  const fullSizeRange = [38, 39, 40, 41, 42, 43, 44, 45];
  const displaySizes = fullSizeRange.map((size) => {
    const existing = product.sizes.find((s) => s.size === size);
    return existing ? existing : { size, stock: 0 };
  });

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* ── Images ─────────────────────────────────────── */}
          <div>
            <div className='rounded-2xl overflow-hidden bg-zinc-100 aspect-square mb-4'>
              <img
                src={galleryImages[imgIdx]}
                alt={product.name}
                className='w-full h-full object-cover mix-blend-multiply'
              />
            </div>
            <div className='flex gap-3'>
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition ${
                    imgIdx === i ? 'border-black' : 'border-transparent'
                  } bg-zinc-50`}
                >
                  <img
                    src={img}
                    alt=''
                    className='w-full h-full object-cover mix-blend-multiply'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info ───────────────────────────────────────── */}
          <div>
            {/* Badges */}
            <div className='flex gap-2 mb-3'>
              <span className='text-xs font-bold bg-black text-white px-3 py-1 rounded-full'>
                {product.tier}
              </span>
              <span className='text-xs font-bold bg-zinc-200 text-black px-3 py-1 rounded-full'>
                {product.surfaceType}
              </span>
              <span className='text-xs font-bold bg-zinc-200 text-black px-3 py-1 rounded-full'>
                {product.category}
              </span>
            </div>

            <h1 className='text-2xl md:text-3xl font-black text-gray-900 mb-2'>
              {product.name}
            </h1>

            {/* Rating */}
            <div className='flex items-center gap-2 mb-4'>
              <div className='flex'>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-zinc-200'}`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
              </div>
              <span className='text-sm text-zinc-400'>
                {product.rating} ({product.numReviews} đánh giá)
              </span>
            </div>

            {/* Price */}
            <div className='flex items-center gap-3 mb-6'>
              <span className='text-3xl font-black'>
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {product.originalPrice && (
                <>
                  <span className='text-lg text-zinc-400 line-through'>
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Size */}
            <div className='mb-6'>
              <SizeSelector
                sizes={displaySizes}
                selected={size}
                onChange={setSize}
              />
            </div>

            {/* Qty */}
            <div className='flex items-center gap-4 mb-6'>
              <span className='text-sm font-bold'>Số lượng:</span>
              <div className='flex items-center border border-zinc-300 rounded-full overflow-hidden'>
                <button
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  className='w-9 h-9 flex items-center justify-center text-lg hover:bg-zinc-100 transition'
                >
                  −
                </button>
                <span className='w-10 text-center text-sm font-bold'>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className='w-9 h-9 flex items-center justify-center text-lg hover:bg-zinc-100 transition'
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-3 mb-6'>
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
                className='flex-1 bg-black text-white font-black py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-800 transition disabled:opacity-40 disabled:cursor-not-allowed'
              >
                {product.totalStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
              <button
                onClick={handleWishlist}
                className='w-14 h-14 rounded-full border-2 border-zinc-300 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                </svg>
              </button>
            </div>

            {/* Shipping info */}
            <div className='bg-zinc-50 rounded-xl p-4 space-y-2 text-sm text-zinc-600'>
              <p>🚚 Miễn phí vận chuyển cho đơn từ 1.500.000đ</p>
              <p>↩️ Đổi trả trong 30 ngày</p>
              <p>✅ Hàng chính hãng 100%</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className='mt-16 border-b border-zinc-200'>
          <div className='flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide'>
            {[
              { key: 'desc', label: 'Mô tả' },
              { key: 'warranty', label: 'Bảo hành' },
              { key: 'advice', label: 'Lời khuyên' },
              { key: 'reviews', label: `Đánh giá (${product.numReviews})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition ${
                  tab === t.key
                    ? 'border-black text-black'
                    : 'border-transparent text-zinc-400 hover:text-black'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        {tab === 'desc' && (
          <div className='py-12'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
               {/* Left: Text Content */}
               <div className='lg:col-span-7 space-y-12'>
                  <div className='relative'>
                     <h3 className='text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4'>
                        <span className='w-12 h-1 bg-black'></span>
                        Thông tin sản phẩm
                     </h3>
                     <div className='prose prose-zinc max-w-none'>
                        <p className='text-zinc-600 leading-relaxed text-xl font-medium'>
                           {product.description}
                        </p>
                        <p className='text-zinc-500 mt-6 leading-relaxed'>
                           Được thiết kế để tối ưu hóa tốc độ và khả năng kiểm soát bóng, phiên bản này mang lại cảm giác bóng chân thực nhất. Cấu trúc Flyknit ôm sát kết hợp cùng công nghệ All Conditions Control (ACC) giúp bạn duy trì phong độ đỉnh cao trong mọi điều kiện thời tiết.
                        </p>
                     </div>
                  </div>

                  <div className='bg-zinc-50 rounded-[2.5rem] p-10 border border-zinc-100'>
                     <h4 className='text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-6'>Đặc điểm nổi bật</h4>
                     <ul className='space-y-4'>
                        {[
                           'Cấu trúc da tổng hợp cao cấp mềm mại, tăng độ bám bóng.',
                           'Lớp đệm Air Zoom thế hệ mới hỗ trợ bứt tốc tức thì.',
                           'Cổ thun Dynamic Fit ôm sát cổ chân, tạo sự linh hoạt.',
                           'Hệ thống đinh chuyên dụng cho độ bám đa hướng.'
                        ].map((item, i) => (
                           <li key={i} className='flex items-start gap-4 text-zinc-700 font-bold text-sm'>
                              <span className='w-1.5 h-1.5 bg-black rounded-full mt-2 shrink-0'></span>
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* Right: Technical Specs Table */}
               <div className='lg:col-span-5'>
                  <div className='bg-white rounded-[3rem] p-10 shadow-2xl border border-zinc-50 sticky top-32'>
                     <h3 className='text-xs font-black uppercase tracking-[0.3em] text-zinc-400 mb-10'>Thông số kỹ thuật</h3>
                     <div className='space-y-8'>
                        {[
                           { label: 'Phân khúc', value: product.tier, sub: 'Cấp độ chuyên nghiệp' },
                           { label: 'Loại sân', value: product.surfaceType, sub: 'Cỏ tự nhiên / Nhân tạo' },
                           { label: 'Dòng giày', value: product.category, sub: 'Tối ưu tốc độ' },
                           { label: 'Màu sắc', value: product.color || 'Đa sắc', sub: 'Colorway chính thức' },
                           { label: 'Trọng lượng', value: '185g', sub: 'Siêu nhẹ' }
                        ].map((spec, i) => (
                           <div key={i} className='flex items-center justify-between group cursor-default'>
                              <div>
                                 <p className='text-[10px] font-black uppercase text-zinc-300 tracking-widest group-hover:text-black transition-colors'>{spec.label}</p>
                                 <p className='text-lg font-black text-black mt-0.5 tracking-tight'>{spec.value}</p>
                              </div>
                              <div className='text-right'>
                                 <p className='text-[9px] font-bold text-zinc-400 italic'>{spec.sub}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className='mt-12 pt-8 border-t border-zinc-100 flex items-center gap-4 text-zinc-400'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'/></svg>
                        <span className='text-[10px] font-black uppercase tracking-widest'>Kiểm định bởi Nike Football</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Warranty Tab */}
        {tab === 'warranty' && (
          <div className='py-8 max-w-3xl'>
            <h3 className='text-2xl font-black mb-6'>Chính sách bảo hành & Đổi trả</h3>
            <ul className='space-y-4 text-zinc-600 leading-relaxed text-lg list-none'>
              <li className='flex gap-3'><span className='text-green-500'>✔</span> Bảo hành keo đế <strong>3 tháng</strong> kể từ ngày mua.</li>
              <li className='flex gap-3'><span className='text-green-500'>✔</span> Hỗ trợ đổi size trong vòng <strong>7 ngày</strong> (sản phẩm chưa qua sử dụng).</li>
              <li className='flex gap-3'><span className='text-green-500'>✔</span> Miễn phí bảo dưỡng, vệ sinh giày 1 lần trong tháng đầu tiên.</li>
              <li className='flex gap-3'><span className='text-green-500'>✔</span> Cam kết 100% hàng chính hãng. Hoàn tiền x10 nếu phát hiện hàng giả.</li>
            </ul>
          </div>
        )}

        {/* Advice Tab */}
        {tab === 'advice' && (
          <div className='py-8 max-w-3xl'>
            <h3 className='text-2xl font-black mb-6'>Lời khuyên chọn giày</h3>
            <div className='space-y-6 text-zinc-600 leading-relaxed text-lg'>
              <div className='bg-blue-50 text-blue-900 p-6 rounded-2xl'>
                <p className='font-black mb-2 flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Dành cho form chân:
                </p>
                <p>{product.category === 'Mercurial' || product.category === 'Vapor' ? 'Dòng giày này có form ôm sát, phù hợp với bàn chân thon dài. Nếu bạn có bàn chân bè (to ngang), hãy cân nhắc tăng lên 0.5 - 1 size để thoải mái nhất.' : 'Form giày tương đối thoải mái, phù hợp với hầu hết các kiểu bàn chân (kể cả chân bè nhẹ).'}</p>
              </div>
              <div className='bg-green-50 text-green-900 p-6 rounded-2xl'>
                <p className='font-black mb-2 flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Loại sân thi đấu:
                </p>
                <p>{product.surfaceType === 'FG' ? 'Đế FG lý tưởng cho sân cỏ tự nhiên hoặc sân cỏ nhân tạo có chất lượng cao, lớp cỏ dày và êm.' : product.surfaceType === 'TF' ? 'Đế TF với đinh dăm cao su bám sân siêu tốt trên mặt sân cỏ nhân tạo tiêu chuẩn ở Việt Nam (5-7 người).' : 'Đế AG chuyên dụng cho sân cỏ nhân tạo, cấu trúc đinh tròn giúp bám sân và xoay chuyển mượt mà.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className='py-8 max-w-2xl space-y-6'>
            {/* Write review */}
            {user ? (
              <form
                onSubmit={handleReview}
                className='bg-zinc-50 rounded-2xl p-6 space-y-4'
              >
                <h4 className='font-black text-sm uppercase tracking-wide'>
                  Viết đánh giá
                </h4>
                <div className='flex gap-2'>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type='button'
                      onClick={() => setReview((r) => ({ ...r, rating: s }))}
                    >
                      <svg
                        className={`w-6 h-6 ${s <= review.rating ? 'text-yellow-400' : 'text-zinc-300'}`}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder='Nhận xét của bạn...'
                  value={review.comment}
                  onChange={(e) =>
                    setReview((r) => ({ ...r, comment: e.target.value }))
                  }
                  className='w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-black resize-none'
                />
                <button
                  type='submit'
                  disabled={submitting}
                  className='bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition disabled:opacity-50'
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            ) : (
              <div className='bg-zinc-50 rounded-2xl p-6 text-center'>
                <p className='text-zinc-500 text-sm mb-3'>
                  Đăng nhập để viết đánh giá
                </p>
                <button
                  onClick={() => navigate('/auth')}
                  className='bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition'
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {/* Review list */}
            {product.reviews.length === 0 ? (
              <p className='text-zinc-400 text-sm text-center py-8'>
                Chưa có đánh giá nào.
              </p>
            ) : (
              product.reviews.map((r) => (
                <div key={r._id} className='border-b border-zinc-100 pb-4'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold'>
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className='text-sm font-bold'>{r.name}</p>
                      <div className='flex'>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-3 h-3 ${s <= r.rating ? 'text-yellow-400' : 'text-zinc-200'}`}
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <span className='ml-auto text-xs text-zinc-400'>
                      {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className='text-sm text-zinc-600 ml-11'>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Related ───────────────────────────────────────── */}
        {related.length > 0 && (
          <div className='mt-16'>
            <h3 className='text-2xl font-black uppercase tracking-wide mb-6'>
              Sản phẩm liên quan
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Success Modal */}
      {showCartModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative animate-in fade-in zoom-in-95 duration-200 rounded-3xl border border-zinc-100'>
            <div className='p-8 pb-6'>
              <button 
                onClick={() => setShowCartModal(false)}
                className='absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition text-zinc-500 hover:text-black font-bold'
              >
                ✕
              </button>
              
              <h3 className='text-2xl font-black mb-6 text-black flex items-center gap-2'>
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Thêm vào giỏ hàng thành công
              </h3>
              
              <div className='flex gap-5 mb-2'>
                <div className='w-32 h-32 shrink-0 bg-zinc-50 flex items-center justify-center rounded-2xl border border-zinc-100'>
                  <img src={galleryImages[0]} alt={product.name} className='w-full h-full object-cover mix-blend-multiply p-2' />
                </div>
                <div className='text-sm space-y-1.5 text-black flex-1 py-1'>
                  <p className='font-bold uppercase text-black text-base leading-snug line-clamp-2'>{product.name}</p>
                  <p className='text-zinc-500 pt-1'>Mã SP: {product._id.slice(-6).toUpperCase()}-{size}-{qty}</p>
                  <p className='text-zinc-500'>Size (EU): <strong className='text-black'>{size}</strong></p>
                  <p className='text-zinc-500'>Số lượng: <strong className='text-black'>{qty}</strong></p>
                  <p className='font-black text-black text-xl mt-3'>{product.price.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </div>
            
            <div className='px-8 pb-8 pt-2 flex flex-col gap-3'>
              <button 
                onClick={() => {
                  setShowCartModal(false);
                  navigate('/checkout');
                }}
                className='w-full bg-black text-white py-4 rounded-2xl font-bold text-base hover:bg-zinc-800 transition shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5'
              >
                Thanh toán ngay
              </button>
              <button 
                onClick={() => {
                  setShowCartModal(false);
                  window.dispatchEvent(new Event('open-cart'));
                }}
                className='w-full bg-white text-black py-4 rounded-2xl font-bold text-base border-2 border-zinc-200 hover:border-black transition'
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
