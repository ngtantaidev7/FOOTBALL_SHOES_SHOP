import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminStatsAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await getAdminStatsAPI();
        setStats(data.data);
      } catch (err) {
        toast.error('Không thể tải dữ liệu thống kê');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (loading || !stats) return (
    <div className='min-h-screen flex items-center justify-center bg-zinc-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
        <p className='text-sm font-bold uppercase tracking-widest text-zinc-400'>Đang khởi tạo hệ thống...</p>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-[#F0F2F5] flex'>
      <AdminSidebar stats={stats} />

      {/* Main Content */}

      {/* Main Content */}
      <main className='flex-1 p-8'>
        {/* Top Cards Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex justify-between items-center relative overflow-hidden'>
             <div className='relative z-10'>
                <h2 className='text-zinc-400 text-sm font-bold'>Welcome <span className='text-blue-600'>{user.name}</span></h2>
                <p className='text-xs text-zinc-400 mt-1'>Hệ thống đang hoạt động ổn định</p>
             </div>
             <div className='text-4xl font-black text-zinc-800 z-10'>{stats.orders.total}</div>
             <div className='absolute right-0 bottom-0 opacity-5 -mr-10 -mb-10'>
                <svg className='w-48 h-48' fill='currentColor' viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
             </div>
          </div>
          <div className='bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex justify-between items-center'>
             <div>
                <h2 className='text-zinc-400 text-sm font-bold uppercase tracking-widest'>Trực tuyến</h2>
                <p className='text-xs text-zinc-400 mt-1'>Số lượng người đang truy cập</p>
             </div>
             <div className='text-4xl font-black text-blue-600'>325</div>
          </div>
        </div>

        {/* Small Stat Cards Section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          {[
            { label: 'Doanh thu', value: stats.revenue.month.toLocaleString('vi-VN') + 'đ', color: 'bg-blue-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Chờ xử lý', value: stats.recentOrders.filter(o => o.status === 'pending').length, color: 'bg-orange-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Hoàn tất', value: stats.recentOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Khách hàng', value: stats.customers, color: 'bg-yellow-600', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
          ].map((item) => (
            <div key={item.label} className='bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden group'>
              <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-zinc-400 text-[10px] font-black uppercase tracking-widest'>{item.label}</h3>
                    <p className='text-xl font-black mt-1'>{item.value}</p>
                  </div>
                  <div className='text-zinc-200 group-hover:text-zinc-400 transition-colors'>
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d={item.icon}/></svg>
                  </div>
                </div>
                <div className='flex items-center gap-2 text-[10px] font-bold text-zinc-400'>
                  <span className='text-green-500'>+12%</span> so với tuần trước
                </div>
              </div>
              <div className={`h-1.5 ${item.color} w-full mt-auto`}></div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
          {/* Active Orders Table */}
          <div className='xl:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-100 p-8'>
            <div className='flex items-center justify-between mb-8'>
              <h3 className='text-sm font-black uppercase tracking-widest text-zinc-500'>Đơn hàng gần đây</h3>
              <button className='text-xs font-bold text-blue-600 hover:underline'>Xem tất cả</button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='text-zinc-400 uppercase tracking-widest border-b border-zinc-50'>
                    <th className='pb-4 font-black'>ID</th>
                    <th className='pb-4 font-black'>Tên sản phẩm</th>
                    <th className='pb-4 font-black text-center'>Số lượng</th>
                    <th className='pb-4 font-black'>Khách hàng</th>
                    <th className='pb-4 font-black'>Ngày đặt</th>
                    <th className='pb-4 font-black text-right'>Tổng</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-zinc-50'>
                  {stats.recentOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className='hover:bg-zinc-50 transition cursor-pointer group'
                    >
                      <td className='py-4 font-bold text-blue-600 group-hover:underline'>#{order.id.slice(-6).toUpperCase()}</td>
                      <td className='py-4 font-medium text-zinc-700 max-w-[150px] truncate'>{order.items[0]?.name} {order.items.length > 1 ? `+${order.items.length - 1}` : ''}</td>
                      <td className='py-4 text-center font-bold text-zinc-500'>{order.items.reduce((acc, i) => acc + i.quantity, 0)}</td>
                      <td className='py-4 text-zinc-600'>{order.customer}</td>
                      <td className='py-4 text-zinc-400'>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                      <td className='py-4 text-right font-black text-zinc-800'>{order.total.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Column */}
          <div className='bg-white rounded-2xl shadow-sm border border-zinc-100 p-8'>
            <h3 className='text-sm font-black uppercase tracking-widest text-zinc-500 mb-8'>Phân tích doanh thu</h3>
            <div className='space-y-6'>
               <div className='h-64 flex items-end justify-between gap-3 px-2'>
                  {[40, 70, 30, 45, 85, 60, 75].map((h, i) => (
                    <div key={i} className='flex-1 flex flex-col justify-end h-full'>
                       <div 
                         className='w-full bg-blue-600 rounded-t-xl hover:bg-blue-500 transition-all cursor-pointer relative group'
                         style={{ height: `${h}%` }}
                       >
                          <div className='absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl'>
                             {h}%
                          </div>
                       </div>
                       <span className='text-[10px] font-black text-zinc-400 text-center mt-3 uppercase tracking-tighter'>Tháng {i+1}</span>
                    </div>
                  ))}
               </div>
               <div className='pt-6 border-t border-zinc-50'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-xs font-bold text-zinc-500'>Đạt chỉ tiêu tháng</span>
                    <span className='text-xs font-black text-blue-600'>85%</span>
                  </div>
                  <div className='w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden'>
                    <div className='h-full bg-blue-600 rounded-full' style={{ width: '85%' }} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <div className='bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200'>
            <div className='p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50'>
              <div>
                <h2 className='text-2xl font-black uppercase tracking-tighter'>Chi tiết đơn hàng #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                <p className='text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1'>Ngày đặt: {new Date(selectedOrder.date).toLocaleString('vi-VN')}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className='w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-zinc-50 transition'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
            </div>

            <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto'>
               {/* Items List */}
               <div className='space-y-4'>
                  <h3 className='text-xs font-black uppercase tracking-widest text-zinc-400 mb-4'>Sản phẩm</h3>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className='flex items-center gap-4 bg-zinc-50 p-3 rounded-2xl'>
                       <div className='flex-1'>
                          <p className='text-sm font-black leading-tight'>{item.name}</p>
                          <p className='text-[10px] text-zinc-500 mt-1 font-bold'>SL: {item.quantity} × {item.price.toLocaleString('vi-VN')}đ</p>
                       </div>
                       <div className='text-sm font-black'>{(item.quantity * item.price).toLocaleString('vi-VN')}đ</div>
                    </div>
                  ))}
               </div>

               {/* Shipping & Payment */}
               <div className='space-y-6'>
                  <div>
                    <h3 className='text-xs font-black uppercase tracking-widest text-zinc-400 mb-2'>Khách hàng</h3>
                    <p className='text-sm font-bold'>{selectedOrder.shippingInfo.fullName}</p>
                    <p className='text-xs text-zinc-500'>{selectedOrder.shippingInfo.phone} · {selectedOrder.shippingInfo.email}</p>
                    <p className='text-xs text-zinc-500 mt-1'>{selectedOrder.shippingInfo.street}, {selectedOrder.shippingInfo.ward}, {selectedOrder.shippingInfo.district}, {selectedOrder.shippingInfo.city}</p>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <h3 className='text-xs font-black uppercase tracking-widest text-zinc-400 mb-2'>Thanh toán</h3>
                      <span className='px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-[10px] font-black uppercase'>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div>
                      <h3 className='text-xs font-black uppercase tracking-widest text-zinc-400 mb-2'>Trạng thái</h3>
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
               </div>
            </div>

            <div className='p-8 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between'>
               <div className='text-zinc-400 text-xs font-bold uppercase tracking-widest'>Tổng thanh toán</div>
               <div className='text-3xl font-black'>{selectedOrder.total.toLocaleString('vi-VN')}đ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
