import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdAPI } from '../services/orderService';
import { motion } from 'framer-motion';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-50', bar: 'w-1/4 bg-yellow-500', icon: '⏳' },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-600 bg-blue-50', bar: 'w-1/2 bg-blue-500', icon: '✅' },
  shipping: { label: 'Đang giao', color: 'text-purple-600 bg-purple-50', bar: 'w-3/4 bg-purple-500', icon: '🚚' },
  delivered: { label: 'Đã giao', color: 'text-green-600 bg-green-50', bar: 'w-full bg-green-500', icon: '📦' },
  cancelled: { label: 'Đã huỷ', color: 'text-red-600 bg-red-50', bar: 'w-full bg-red-500', icon: '❌' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getOrderByIdAPI(id);
        setOrder(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading)
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-white'>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className='w-12 h-12 border-4 border-zinc-100 border-t-black rounded-full' 
        />
        <p className='mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300'>Nike Football Loading</p>
      </div>
    );

  if (!order)
    return (
      <div className='text-center py-32 bg-white min-h-screen flex flex-col items-center justify-center'>
        <h2 className='text-4xl font-black uppercase tracking-tighter mb-4'>Order Not Found</h2>
        <Link to='/shop' className='bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all'>
          Back to Shop
        </Link>
      </div>
    );

  const st = STATUS_MAP[order.orderStatus] || STATUS_MAP.pending;

  return (
    <div className='min-h-screen bg-[#f5f5f7] pb-32 selection:bg-black selection:text-white'>
      
      {/* Background Watermark Swoosh */}
      <div className='fixed top-0 right-0 opacity-[0.02] pointer-events-none -mr-40 -mt-20'>
         <svg className='w-[800px] h-[800px]' viewBox='0 0 192.756 192.756'><path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' /></svg>
      </div>

      <div className='max-w-6xl mx-auto px-6'>
        
        {/* Cinematic Header */}
        <div className='pt-20 pb-16 text-center relative z-10'>
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className='w-24 h-24 bg-[#22c55e] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_20px_50px_rgba(34,197,94,0.3)]'
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4'
          >
            Tuyệt vời!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-zinc-500 font-bold max-w-lg mx-auto leading-relaxed'
          >
            Đơn hàng của bạn đã được tiếp nhận. Chúng tôi đang nhanh chóng chuẩn bị những siêu phẩm này để gửi đến bạn.
          </motion.p>
          
          <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
             <div className='bg-white px-6 py-3 rounded-full shadow-sm border border-zinc-100 flex items-center gap-3'>
                <span className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Mã Đơn Hàng</span>
                <span className='text-xs font-mono font-bold'>{order._id}</span>
             </div>
             <div className='bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3'>
                <span className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Ngày Đặt</span>
                <span className='text-xs font-bold'>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
             </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className='mb-16 bg-white rounded-[2.5rem] p-10 shadow-sm border border-zinc-100 overflow-hidden relative'>
           <div className='flex items-center justify-between mb-8'>
              <h2 className='text-xs font-black uppercase tracking-[0.2em]'>Tiến trình đơn hàng</h2>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${st.color}`}>
                 {st.label}
              </span>
           </div>
           <div className='relative h-3 bg-zinc-100 rounded-full w-full mb-4 overflow-hidden'>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: st.bar.split(' ')[0] }}
                transition={{ duration: 1, ease: "circOut" }}
                className={`absolute top-0 left-0 h-full rounded-full ${st.bar.split(' ')[1]}`}
              />
           </div>
           <div className='flex justify-between px-2'>
              {['Chờ xác nhận', 'Xác nhận', 'Đang giao', 'Hoàn tất'].map((label, idx) => (
                <span key={idx} className='text-[9px] font-black uppercase text-zinc-300 tracking-tighter'>{label}</span>
              ))}
           </div>
        </div>

        {/* Main Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-start'>
          
          {/* Left: Products & Shipping (7 Cols) */}
          <div className='lg:col-span-7 space-y-10'>
             
             {/* Products List Card */}
             <div className='bg-white rounded-[3rem] p-10 shadow-sm border border-zinc-100'>
                <div className='flex items-center gap-4 mb-10'>
                   <div className='w-1 h-8 bg-black rounded-full' />
                   <h3 className='text-xl font-black uppercase tracking-tighter'>Sản phẩm trong túi</h3>
                </div>
                <div className='space-y-10'>
                   {order.items.map((item, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className='flex gap-8 group'
                      >
                         <div className='w-32 h-32 bg-zinc-50 rounded-[2rem] overflow-hidden shrink-0 border border-zinc-100 p-2'>
                            <img src={item.image} alt={item.name} className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-700' />
                         </div>
                         <div className='flex-1 py-2 flex flex-col justify-between'>
                            <div>
                               <h4 className='text-lg font-black uppercase leading-tight line-clamp-2'>{item.name}</h4>
                               <div className='flex gap-6 mt-3'>
                                  <div className='flex flex-col'>
                                     <span className='text-[9px] font-black text-zinc-300 uppercase tracking-widest'>Size</span>
                                     <span className='text-xs font-bold uppercase'>EU {item.size}</span>
                                  </div>
                                  <div className='flex flex-col'>
                                     <span className='text-[9px] font-black text-zinc-300 uppercase tracking-widest'>Số lượng</span>
                                     <span className='text-xs font-bold uppercase'>x{item.quantity}</span>
                                  </div>
                               </div>
                            </div>
                            <p className='text-lg font-black tracking-tighter mt-4'>{item.price.toLocaleString('vi-VN')}đ</p>
                         </div>
                      </motion.div>
                   ))}
                </div>
             </div>

             {/* Detailed Info Grid */}
             <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100'>
                   <p className='text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-6'>Địa chỉ giao hàng</p>
                   <div className='space-y-4'>
                      <div>
                         <p className='text-sm font-black uppercase'>{order.shippingInfo.fullName}</p>
                         <p className='text-xs font-bold text-zinc-400 mt-1'>{order.shippingInfo.phone}</p>
                      </div>
                      <p className='text-xs font-bold leading-relaxed text-zinc-500'>
                         {order.shippingInfo.street}<br/>
                         {order.shippingInfo.ward}, {order.shippingInfo.district}<br/>
                         {order.shippingInfo.city}
                      </p>
                   </div>
                </div>

                <div className='bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100'>
                   <p className='text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-6'>Thanh toán & Ghi chú</p>
                   <div className='space-y-6'>
                      <div>
                         <p className='text-[9px] font-black text-zinc-300 uppercase mb-2'>Phương thức</p>
                         <div className='flex items-center gap-3'>
                            <span className='text-2xl'>{order.paymentMethod === 'cod' ? '💵' : '📸'}</span>
                            <span className='text-xs font-black uppercase'>{order.paymentMethod === 'cod' ? 'Khi nhận hàng (COD)' : 'Chuyển khoản QR'}</span>
                         </div>
                      </div>
                      {order.note && (
                         <div>
                            <p className='text-[9px] font-black text-zinc-300 uppercase mb-2'>Ghi chú</p>
                            <p className='text-xs font-medium text-zinc-500 italic'>"{order.note}"</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Summary Card (5 Cols) */}
          <div className='lg:col-span-5'>
             <div className='bg-black text-white rounded-[3rem] p-10 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.15)] sticky top-32'>
                <h3 className='text-xl font-black uppercase tracking-tighter mb-10'>Tổng kết đơn hàng</h3>
                
                <div className='space-y-5'>
                   <div className='flex justify-between items-center opacity-60'>
                      <span className='text-[10px] font-black uppercase tracking-widest'>Tạm tính</span>
                      <span className='text-sm font-bold'>{order.itemsPrice.toLocaleString('vi-VN')}đ</span>
                   </div>
                   <div className='flex justify-between items-center opacity-60'>
                      <span className='text-[10px] font-black uppercase tracking-widest'>Phí vận chuyển</span>
                      <span className='text-sm font-bold'>{order.shippingPrice === 0 ? 'FREE' : `${order.shippingPrice.toLocaleString('vi-VN')}đ`}</span>
                   </div>
                   
                   <div className='pt-10 mt-10 border-t border-white/10'>
                      <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4'>Số tiền cuối cùng</p>
                      <div className='flex flex-col gap-4'>
                         <span className='text-xs font-black uppercase tracking-tighter leading-tight text-zinc-400'>
                            Bạn cần thanh toán khi nhận hàng
                         </span>
                         <span className='text-5xl font-black tracking-tighter'>
                            {order.totalPrice.toLocaleString('vi-VN')}đ
                         </span>
                      </div>
                   </div>
                </div>

                <div className='mt-12 space-y-4'>
                   <Link 
                     to='/shop' 
                     className='block w-full bg-white text-black font-black py-6 rounded-full text-center text-xs uppercase tracking-[0.2em] hover:scale-[1.03] transition-all active:scale-95'
                   >
                     Tiếp tục mua hàng
                   </Link>
                   <Link 
                     to='/orders' 
                     className='block w-full border-2 border-white/20 text-white font-black py-6 rounded-full text-center text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all'
                   >
                     Quản lý đơn hàng
                   </Link>
                </div>

                {/* Micro-interaction Swoosh Icon */}
                <div className='absolute bottom-8 right-12 opacity-10'>
                   <svg className='w-20 h-20 fill-white' viewBox='0 0 192.756 192.756'><path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' /></svg>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
