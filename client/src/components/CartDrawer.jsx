import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

export default function CartDrawer({ open, onClose }) {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, clearCart } = useCartStore();

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-zinc-100'>
          <div>
            <h2 className='text-lg font-black uppercase tracking-widest'>
              Giỏ hàng
            </h2>
            <p className='text-xs text-zinc-400'>{totalQty} sản phẩm</p>
          </div>
          <div className='flex items-center gap-3'>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className='text-xs text-zinc-400 hover:text-red-500 transition underline'
              >
                Xoá tất cả
              </button>
            )}
            <button
              onClick={onClose}
              className='w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                viewBox='0 0 24 24'
              >
                <path d='M18 6 6 18M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4'>
          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full gap-4 text-center'>
              <svg
                className='w-20 h-20 text-zinc-200'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                viewBox='0 0 24 24'
              >
                <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
                <line x1='3' y1='6' x2='21' y2='6' />
                <path d='M16 10a4 4 0 0 1-8 0' />
              </svg>
              <p className='text-zinc-400 font-medium'>Giỏ hàng đang trống</p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}
                className='bg-black text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition'
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item._id}-${item.selectedSize}-${idx}`}
                className='flex gap-4 bg-zinc-50 rounded-xl p-3'
              >
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className='w-20 h-20 object-cover rounded-lg shrink-0 bg-white'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-bold text-gray-900 line-clamp-2 leading-snug'>
                    {item.name}
                  </p>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className='text-xs bg-black text-white px-2 py-0.5 rounded-full'>
                      EU {item.selectedSize}
                    </span>
                    <span className='text-xs text-zinc-400'>
                      {item.surfaceType}
                    </span>
                  </div>
                  <p className='text-sm font-black text-black mt-1'>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </p>
                  <div className='flex items-center justify-between mt-2'>
                    <div className='flex items-center border border-zinc-300 rounded-full overflow-hidden bg-white text-black'>
                      <button
                        onClick={() =>
                          updateQty(
                            item._id,
                            item.selectedSize,
                            item.quantity - 1,
                          )
                        }
                        className='w-7 h-7 flex items-center justify-center text-lg font-bold hover:bg-zinc-200 transition text-black'
                      >
                        −
                      </button>
                      <span className='w-7 text-center text-sm font-bold text-black'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(
                            item._id,
                            item.selectedSize,
                            item.quantity + 1,
                          )
                        }
                        className='w-7 h-7 flex items-center justify-center text-lg font-bold hover:bg-zinc-200 transition text-black'
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id, item.selectedSize)}
                      className='text-zinc-300 hover:text-red-500 transition'
                    >
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <polyline points='3 6 5 6 21 6' />
                        <path d='M19 6l-1 14H6L5 6' />
                        <path d='M10 11v6M14 11v6M9 6V4h6v2' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className='border-t border-zinc-100 px-6 py-5 space-y-4 bg-white'>
            {totalPrice < 1_500_000 ? (
              <div className='bg-zinc-50 rounded-xl p-3 text-xs text-zinc-500'>
                🚚 Mua thêm{' '}
                <strong className='text-black'>
                  {(1_500_000 - totalPrice).toLocaleString('vi-VN')}đ
                </strong>{' '}
                để được miễn phí vận chuyển
                <div className='w-full bg-zinc-200 rounded-full h-1.5 mt-2'>
                  <div
                    className='bg-black h-1.5 rounded-full transition-all'
                    style={{
                      width: `${Math.min((totalPrice / 1_500_000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p className='text-xs text-green-600 font-medium text-center'>
                🎉 Bạn được miễn phí vận chuyển!
              </p>
            )}

            <div className='flex items-center justify-between'>
              <span className='text-sm text-zinc-500'>Tạm tính</span>
              <span className='text-lg font-black'>
                {totalPrice.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className='w-full bg-black text-white font-bold py-4 rounded-full hover:bg-zinc-800 transition text-sm uppercase tracking-widest'
            >
              Thanh toán
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/shop');
              }}
              className='w-full text-center text-sm text-zinc-400 hover:text-black transition underline'
            >
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </div>
    </>
  );
}
