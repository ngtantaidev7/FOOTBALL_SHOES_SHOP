import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAllOrdersAPI, updateOrderStatusAPI, getAdminStatsAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminOrdersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchOrders();
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStatsAPI();
      setStats(data.data);
    } catch (err) {}
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrdersAPI();
      setOrders(data.data);
    } catch (err) {
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateOrderStatusAPI(id, { orderStatus: status });
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders();
      if (selectedOrder?._id === id) {
         setSelectedOrder(prev => ({ ...prev, orderStatus: status }));
      }
    } catch (err) {
      toast.error('Cập nhật thất bại');
    }
  };

  const statusMap = {
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-600' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-zinc-100 text-zinc-600' },
    shipping: { label: 'Đang giao', color: 'bg-blue-100 text-blue-600' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-600' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600' }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(filter.toLowerCase()) || 
    o.shippingInfo.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-[#F0F2F5] flex'>
      <AdminSidebar stats={stats} />

      <main className='flex-1 p-8'>
        <div className='flex items-center justify-between mb-10'>
           <div>
              <h1 className='text-3xl font-black uppercase tracking-tighter'>Quản lý đơn hàng</h1>
              <p className='text-zinc-500'>Kiểm soát và xử lý các đơn hàng của khách hàng.</p>
           </div>
           <div className='flex items-center gap-4'>
              <input 
                type="text" 
                placeholder="Tìm mã đơn, tên..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className='bg-white border border-zinc-200 px-5 py-2.5 rounded-full text-sm outline-none focus:ring-2 focus:ring-black transition'
              />
              <button onClick={fetchOrders} className='bg-black text-white p-2.5 rounded-full hover:bg-zinc-800 transition'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'/></svg>
              </button>
           </div>
        </div>

        {/* Orders Table */}
        <div className='bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden'>
           <table className='w-full text-left text-sm'>
              <thead>
                <tr className='bg-zinc-50 text-zinc-400 uppercase text-[10px] tracking-widest border-b border-zinc-100'>
                  <th className='px-8 py-4 font-black'>Mã đơn</th>
                  <th className='px-8 py-4 font-black'>Khách hàng</th>
                  <th className='px-8 py-4 font-black'>Ngày đặt</th>
                  <th className='px-8 py-4 font-black'>Tổng tiền</th>
                  <th className='px-8 py-4 font-black'>Trạng thái</th>
                  <th className='px-8 py-4 font-black text-right'>Hành động</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-50'>
                {loading ? (
                  <tr><td colSpan={6} className='py-20 text-center text-zinc-400 font-bold uppercase tracking-widest'>Đang tải dữ liệu...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={6} className='py-20 text-center text-zinc-400 font-bold uppercase tracking-widest'>Không có đơn hàng nào</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order._id} className='hover:bg-zinc-50 transition group'>
                      <td className='px-8 py-5 font-bold text-blue-600'>#{order._id.slice(-6).toUpperCase()}</td>
                      <td className='px-8 py-5'>
                         <p className='font-black text-zinc-800'>{order.shippingInfo.fullName}</p>
                         <p className='text-[10px] text-zinc-400'>{order.shippingInfo.phone}</p>
                      </td>
                      <td className='px-8 py-5 text-zinc-500'>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className='px-8 py-5 font-black'>{order.totalPrice.toLocaleString('vi-VN')}đ</td>
                      <td className='px-8 py-5'>
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusMap[order.orderStatus].color}`}>
                           {statusMap[order.orderStatus].label}
                         </span>
                      </td>
                      <td className='px-8 py-5 text-right'>
                         <button 
                           onClick={() => setSelectedOrder(order)}
                           className='text-zinc-400 hover:text-black transition p-2'
                         >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'/><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'/></svg>
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md'>
          <div className='bg-white w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-zinc-100'>
             <div className='flex flex-col lg:flex-row h-full max-h-[90vh]'>
                
                {/* Left: Content Area */}
                <div className='flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar'>
                   <div className='flex items-center justify-between mb-10'>
                      <div>
                        <h2 className='text-3xl font-black uppercase tracking-tighter'>Đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
                        <p className='text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1'>
                          {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')} | {new Date(selectedOrder.createdAt).toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[selectedOrder.orderStatus].color}`}>
                         {statusMap[selectedOrder.orderStatus].label}
                      </div>
                   </div>

                   <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                      {/* Products */}
                      <div className='space-y-6'>
                         <div className='flex items-center gap-3'>
                            <div className='w-1 h-4 bg-black rounded-full' />
                            <h3 className='text-[10px] font-black uppercase tracking-widest text-zinc-400'>Danh sách sản phẩm</h3>
                         </div>
                         <div className='space-y-4'>
                            {selectedOrder.items.map((item, i) => (
                              <div key={i} className='flex items-center gap-4 bg-zinc-50 p-4 rounded-[2rem] border border-zinc-100 group hover:border-black transition-all'>
                                 <div className='w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 border border-zinc-100 p-2'>
                                    <img src={item.image} alt={item.name} className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-700' />
                                 </div>
                                 <div className='flex-1 min-w-0'>
                                    <p className='text-xs font-black uppercase leading-tight truncate'>{item.name}</p>
                                    <p className='text-[10px] text-zinc-400 font-bold mt-1 uppercase'>Size: {item.size} | SL: {item.quantity}</p>
                                    <p className='text-xs font-black mt-2'>{item.price.toLocaleString('vi-VN')}đ</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                         
                         <div className='pt-6 border-t border-zinc-100 flex justify-between items-center'>
                            <span className='text-sm font-black uppercase tracking-tighter'>Tổng thanh toán</span>
                            <span className='text-2xl font-black tracking-tighter text-blue-600'>{selectedOrder.totalPrice.toLocaleString('vi-VN')}đ</span>
                         </div>
                      </div>

                      {/* Shipping & Notes */}
                      <div className='space-y-8'>
                         <div className='bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100'>
                            <h3 className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6'>Thông tin giao hàng</h3>
                            <div className='space-y-3'>
                               <div className='flex items-center gap-3'>
                                  <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs'>👤</div>
                                  <p className='text-sm font-black uppercase'>{selectedOrder.shippingInfo.fullName}</p>
                               </div>
                               <div className='flex items-center gap-3'>
                                  <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs'>📞</div>
                                  <p className='text-xs font-bold text-zinc-500'>{selectedOrder.shippingInfo.phone}</p>
                               </div>
                               <div className='flex items-start gap-3 pt-2 border-t border-zinc-200 mt-2'>
                                  <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs shrink-0'>📍</div>
                                  <p className='text-xs text-zinc-500 leading-relaxed'>
                                     {selectedOrder.shippingInfo.street}, {selectedOrder.shippingInfo.ward},<br/>
                                     {selectedOrder.shippingInfo.district}, {selectedOrder.shippingInfo.city}
                                  </p>
                               </div>
                            </div>
                         </div>

                         {selectedOrder.note && (
                           <div className='bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 border-l-4 border-l-black'>
                              <p className='text-[10px] font-black uppercase text-zinc-400 mb-2'>Ghi chú của khách</p>
                              <p className='text-xs italic text-zinc-600 font-medium'>"{selectedOrder.note}"</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Right: Actions Sidebar */}
                <div className='w-full lg:w-[320px] bg-zinc-50 border-l border-zinc-100 p-8 flex flex-col'>
                   <button 
                     onClick={() => setSelectedOrder(null)}
                     className='w-full bg-white text-black font-black py-5 rounded-full text-[10px] uppercase tracking-widest shadow-sm hover:bg-black hover:text-white transition-all mb-10 active:scale-95 border border-zinc-100'
                   >
                      Đóng cửa sổ
                   </button>

                   <div className='flex-1 space-y-8'>
                      <div className='space-y-4'>
                         <h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center'>Cập nhật trạng thái</h3>
                         <div className='grid grid-cols-1 gap-3'>
                            {Object.entries(statusMap).map(([key, val]) => (
                              <button
                                key={key}
                                onClick={() => handleUpdateStatus(selectedOrder._id, key)}
                                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between group ${
                                  selectedOrder.orderStatus === key 
                                  ? 'border-black bg-black text-white shadow-xl translate-x-2' 
                                  : 'border-white bg-white text-zinc-400 hover:border-zinc-200'
                                }`}
                              >
                                {val.label}
                                {selectedOrder.orderStatus === key && (
                                   <div className='w-2 h-2 rounded-full bg-blue-400 animate-pulse' />
                                )}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className='mt-auto pt-8'>
                      <div className='bg-black text-white p-6 rounded-[2rem] relative overflow-hidden group'>
                         <div className='relative z-10'>
                            <p className='text-[9px] font-black uppercase tracking-widest opacity-40 mb-2'>Giao dịch</p>
                            <p className='text-xs font-black uppercase'>{selectedOrder.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Đã thanh toán Online'}</p>
                         </div>
                         <div className='absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform'>
                            <svg className='w-24 h-24' fill='currentColor' viewBox='0 0 24 24'><path d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'/></svg>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </div>
        </div>
      )}
    </div>
  );
}
