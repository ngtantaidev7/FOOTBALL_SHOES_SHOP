import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const {
    _id,
    name,
    slug,
    price,
    originalPrice,
    images,
    tier,
    surfaceType,
    rating,
    numReviews,
    tags = [],
    totalStock,
    sizes = [],
  } = product;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const tierColor =
    {
      Elite: 'text-yellow-600 border-yellow-600',
      Pro: 'text-blue-600 border-blue-600',
      Academy: 'text-zinc-600 border-zinc-600',
    }[tier] || 'text-zinc-600 border-zinc-600';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = sizes.find((s) => s.stock > 0)?.size;
    if (!defaultSize) return;
    addItem({ ...product, selectedSize: defaultSize }, 1);
  };

  return (
    <Link
      to={`/product/${slug || _id}`}
      className='group flex flex-col h-full'
    >
      {/* Image Container */}
      <div className='relative overflow-hidden bg-zinc-100/60 aspect-square rounded-[2rem] mb-6 transition-all duration-500 group-hover:bg-zinc-100/90'>
        <img
          src={images?.[0] || 'https://via.placeholder.com/400x400?text=Nike'}
          alt={name}
          className='w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out p-6'
        />

        {/* Badges */}
        <div className='absolute top-6 left-6 flex flex-col items-start gap-2'>
          {discount > 0 && (
            <span className='bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm'>
              -{discount}%
            </span>
          )}
          {tags.includes('new') && (
            <span className='bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm'>
              Mới
            </span>
          )}
          {tags.includes('limited') && (
            <span className='bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm'>
              Giới hạn
            </span>
          )}
        </div>

        {/* Out of stock */}
        {totalStock === 0 && (
          <div className='absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center'>
            <span className='bg-black text-white px-6 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-xl'>
              Hết hàng
            </span>
          </div>
        )}

        {/* Quick add */}
        {totalStock > 0 && (
          <button
            onClick={handleQuickAdd}
            className='absolute bottom-5 right-5 bg-white text-black w-14 h-14 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-black hover:text-white hover:scale-110'
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
        )}
      </div>

      {/* Info */}
      <div className='flex flex-col flex-1 px-2'>
        <div className='flex items-center gap-2 mb-3'>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tierColor} uppercase tracking-wider`}>
            {tier}
          </span>
          <span className='text-[10px] font-bold text-zinc-500 uppercase tracking-widest'>
            • {surfaceType}
          </span>
        </div>

        <h3 className='text-lg font-black text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors'>
          {name}
        </h3>

        {/* Stars */}
        <div className='flex items-center gap-1.5 mb-4'>
          <div className='flex gap-0.5'>
            {[1, 2, 3, 4, 5].map((s) => (
              <svg
                key={s}
                className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-zinc-200'}`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>
          <span className='text-xs text-zinc-400 font-medium'>({numReviews})</span>
        </div>

        {/* Price */}
        <div className='mt-auto flex items-end gap-3'>
          <span className='text-xl font-black text-black tracking-tight'>
            {price.toLocaleString('vi-VN')}đ
          </span>
          {originalPrice && (
            <span className='text-sm text-zinc-400 line-through font-medium mb-0.5'>
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
