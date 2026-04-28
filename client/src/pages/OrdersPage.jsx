import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG = {
  all: { label: 'Tất cả', color: 'bg-zinc-100 text-zinc-600', border: 'bg-zinc-200' },
  pending: { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700', border: 'bg-amber-500' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', border: 'bg-blue-500' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', border: 'bg-purple-500' },
  delivered: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-700', border: 'bg-green-500' },
  cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-700', border: 'bg-red-500' },
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
    api.get('/orders/my')
      .then((res) => {
        setOrders(res.data.data);
        setFilteredOrders(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Lỗi khi tải danh sách đơn hàng!');
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.orderStatus === activeFilter));
    }
  }, [activeFilter, orders]);

  if (!user) return null;

  return (
    <div className='min-h-screen bg-[#F5F5F5] pb-24'>
      {/* Header Section */}
      <div className='bg-white border-b border-zinc-100 px-6 py-12'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
            <div>
              <h1 className='text-4xl font-black uppercase tracking-[0.2em] text-zinc-900'>ĐƠN HÀNG CỦA TÔI</h1>
              <p className='text-zinc-400 font-bold text-xs mt-2 uppercase tracking-widest'>Quản lý và theo dõi tiến độ đơn hàng</p>
            </div>
            <div className='bg-[#E5000A] text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-200'>
              {orders.length} ĐƠN HÀNG
            </div>
          </div>

          {/* Filter Tabs */}
          <div className='flex items-center gap-2 mt-12 overflow-x-auto pb-4 no-scrollbar'>
            {Object.keys(STATUS_CONFIG).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === key 
                    ? 'bg-black text-white shadow-xl scale-105' 
                    : 'bg-white border border-zinc-200 text-zinc-400 hover:border-black hover:text-black'
                }`}
              >
                {STATUS_CONFIG[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-6 mt-12'>
        {loading ? (
          <div className='space-y-6'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='bg-white h-32 rounded-2xl animate-pulse shadow-sm border border-zinc-100'></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='bg-white rounded-3xl p-20 text-center shadow-sm border border-zinc-100'
          >
            <div className='w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8'>
              <svg className="w-10 h-10 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h2 className='text-2xl font-black uppercase tracking-tight mb-4'>Bạn chưa có đơn hàng nào</h2>
            <p className='text-zinc-400 font-medium mb-10'>Dòng trạng thái này đang chờ đợi những siêu phẩm đầu tiên từ bạn.</p>
            <button 
              onClick={() => navigate('/shop')}
              className='bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all'
            >
              Mua sắm ngay
            </button>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, idx) => {
                const st = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className='group bg-white rounded-2xl shadow-sm border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all duration-300 relative overflow-hidden'
                  >
                    {/* Status Accent Bar */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${st.border}`} />

                    <div className='p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                      {/* Left: Info */}
                      <div className='space-y-4 flex-1'>
                        <div className='flex items-center gap-3'>
                          <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${st.color}`}>
                            {st.label}
                          </span>
                          <span className='text-[10px] font-mono font-bold text-zinc-300'>#{order._id.substring(0, 8)}...{order._id.slice(-4)}</span>
                        </div>
                        
                        <div>
                          <p className='text-sm font-black uppercase tracking-tight text-zinc-900'>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            <span className='text-zinc-300 mx-2'>|</span>
                            <span className='text-zinc-400'>{new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </p>
                          <div className='flex items-center gap-2 mt-2 text-zinc-500'>
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                             <span className='text-[10px] font-bold uppercase tracking-widest'>{order.items.length} SẢN PHẨM</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className='flex flex-col md:items-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-zinc-50'>
                         <p className='text-2xl font-black tracking-tighter text-black'>
                            {order.totalPrice.toLocaleString('vi-VN')}đ
                         </p>
                         <Link 
                           to={`/orders/${order._id}`}
                           className='flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#E5000A] group/btn transition-all'
                         >
                           Xem chi tiết 
                           <motion.span 
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className='inline-block'
                           >
                            →
                           </motion.span>
                         </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Simple Pagination Mockup */}
        {filteredOrders.length > 5 && (
          <div className='mt-12 flex justify-center gap-2'>
            <button className='w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center font-bold text-xs bg-black text-white'>1</button>
            <button className='w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center font-bold text-xs hover:bg-zinc-100 transition-colors'>2</button>
            <button className='w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center font-bold text-xs hover:bg-zinc-100 transition-colors'>→</button>
          </div>
        )}
      </div>
    </div>
  );
}
