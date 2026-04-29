import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG = {
  all: { label: 'Tất cả', color: 'bg-zinc-100 text-zinc-600', border: 'border-zinc-100', icon: '📦' },
  pending: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700', border: 'border-amber-200', icon: '⏳' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200', icon: '✅' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', border: 'border-purple-200', icon: '🚚' },
  delivered: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-700', border: 'border-green-200', icon: '🏆' },
  cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700', border: 'border-red-200', icon: '❌' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      setOrders(res.data.data);
      setFilteredOrders(res.data.data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.orderStatus === activeFilter));
    }
  }, [activeFilter, orders]);

  const handleCancelOrder = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Đã hủy đơn hàng');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  };

  const handleReorder = (order) => {
    // Navigate to shop or add to cart? 
    // For now, let's just go to shop as a simple reorder
    navigate('/shop');
    toast.success('Hãy chọn lại các sản phẩm bạn yêu thích!');
  };

  if (!user) return null;

  return (
    <div className='min-h-screen bg-[#F0F2F5] pb-32'>
      {/* Cinematic Header */}
      <div className='relative h-[400px] overflow-hidden flex items-center justify-center'>
         <div 
           className='absolute inset-0 bg-cover bg-center scale-110 blur-[2px] brightness-75' 
           style={{ backgroundImage: `url('/orders_banner.png')` }}
         />
         <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#F0F2F5]' />
         
         <div className='relative z-10 text-center space-y-4'>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl italic'
            >
               My Orders
            </motion.h1>
            <p className='text-white font-bold uppercase tracking-[0.4em] text-[10px] bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full inline-block'>
               Theo dõi hành trình chinh phục sân cỏ của bạn
            </p>
         </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 -mt-20 relative z-20'>
        {/* Filter Bar */}
        <div className='bg-white p-4 rounded-[2rem] shadow-xl border border-white flex gap-2 overflow-x-auto no-scrollbar mb-12'>
          {Object.keys(STATUS_CONFIG).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`whitespace-nowrap px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                activeFilter === key 
                  ? 'bg-black text-white shadow-2xl scale-105' 
                  : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-black'
              }`}
            >
              {STATUS_CONFIG[key].icon} {STATUS_CONFIG[key].label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className='space-y-8'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='bg-white h-64 rounded-[3rem] animate-pulse shadow-sm border border-white'></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white rounded-[3rem] p-24 text-center shadow-sm border border-white'
          >
            <div className='w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl'>📦</div>
            <h2 className='text-3xl font-black uppercase tracking-tighter mb-4'>Trống trải quá!</h2>
            <p className='text-zinc-400 font-bold text-xs uppercase tracking-widest mb-10'>Bạn chưa có đơn hàng nào ở trạng thái này.</p>
            <button onClick={() => navigate('/shop')} className='bg-black text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-110 transition-all'>Khám phá ngay</button>
          </motion.div>
        ) : (
          <div className='space-y-8'>
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, idx) => {
                const st = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className='group bg-white rounded-[3rem] shadow-sm border border-white hover:border-zinc-200 hover:shadow-2xl transition-all duration-500 overflow-hidden'
                  >
                    <div className='p-10'>
                       <div className='flex flex-col lg:flex-row gap-10'>
                          {/* Left: Items Preview */}
                          <div className='lg:w-1/3 flex gap-3 overflow-hidden'>
                             {order.items.slice(0, 3).map((item, i) => (
                                <div key={i} className='w-24 h-24 bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 shrink-0 relative'>
                                   <img src={item.image} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' />
                                   {i === 2 && order.items.length > 3 && (
                                      <div className='absolute inset-0 bg-black/60 flex items-center justify-center text-white font-black text-xs'>
                                         +{order.items.length - 2}
                                      </div>
                                   )}
                                </div>
                             ))}
                          </div>

                          {/* Middle: Order Info */}
                          <div className='flex-1 space-y-4'>
                             <div className='flex items-center gap-3'>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${st.color}`}>
                                   {st.icon} {st.label}
                                </span>
                                <span className='text-[10px] font-black text-zinc-300 uppercase tracking-widest'>#{order._id.slice(-8).toUpperCase()}</span>
                             </div>
                             
                             <div>
                                <h3 className='text-sm font-black uppercase text-zinc-900'>
                                   {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                                <p className='text-[10px] text-zinc-400 font-bold uppercase mt-1'>
                                   {order.items.length} sản phẩm <span className='mx-2'>•</span> {order.paymentMethod.toUpperCase()}
                                </p>
                             </div>

                             <div className='flex gap-4 pt-4'>
                                <Link 
                                  to={`/orders/${order._id}`}
                                  className='bg-zinc-100 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all'
                                >
                                   Chi tiết
                                </Link>
                                
                                {order.orderStatus === 'pending' && (
                                   <button 
                                     onClick={() => handleCancelOrder(order._id)}
                                     className='text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-6 py-2.5 rounded-full transition-all'
                                   >
                                      Hủy đơn
                                   </button>
                                )}

                                {order.orderStatus === 'delivered' && (
                                   <button 
                                     onClick={() => handleReorder(order)}
                                     className='text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-full transition-all'
                                   >
                                      Mua lại
                                   </button>
                                )}
                             </div>
                          </div>

                          {/* Right: Total Price */}
                          <div className='lg:w-1/4 flex flex-col items-end justify-center border-l border-zinc-50 pl-10'>
                             <p className='text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1'>Tổng thanh toán</p>
                             <p className='text-3xl font-black tracking-tighter text-black'>
                                {order.totalPrice.toLocaleString('vi-VN')}đ
                             </p>
                             <div className='mt-4 flex items-center gap-2'>
                                <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
                                <span className='text-[8px] font-black uppercase text-zinc-400 tracking-widest'>Cập nhật 2 phút trước</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Action Button for Help */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='fixed bottom-10 right-10 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center group z-50'
      >
         <svg className='w-6 h-6 group-hover:rotate-12 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'/></svg>
         <span className='absolute right-20 bg-white text-black px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-zinc-100'>Hỗ trợ đơn hàng</span>
      </motion.button>
    </div>
  );
}
