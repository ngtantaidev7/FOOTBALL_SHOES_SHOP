import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { getAdminStatsAPI, getDetailedReportsAPI } from '../services/orderService';
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
        const [statsRes, reportsRes] = await Promise.all([
           getAdminStatsAPI(),
           getDetailedReportsAPI()
        ]);
        // Fill missing days with 0
        const filledData = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const existing = reportsRes.data.data.salesByDay.find(item => item._id === dateStr);
          filledData.push(existing || { _id: dateStr, revenue: 0, count: 0 });
        }

        setStats({
          ...statsRes.data.data,
          chartData: filledData
        });
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
          <div className='xl:col-span-2 bg-white rounded-3xl shadow-sm border border-zinc-100 p-8 overflow-hidden'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                 <h3 className='text-sm font-black uppercase tracking-widest text-zinc-500'>Đơn hàng gần đây</h3>
                 <p className='text-[10px] text-zinc-400 font-bold mt-1 uppercase'>Kiểm tra và xử lý các đơn hàng mới nhất</p>
              </div>
              <button onClick={() => navigate('/admin/orders')} className='text-[10px] font-black uppercase tracking-widest bg-zinc-50 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all'>Tất cả</button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-xs'>
                <thead>
                  <tr className='text-zinc-300 uppercase tracking-widest border-b border-zinc-50'>
                    <th className='pb-4 font-black'>Mã đơn</th>
                    <th className='pb-4 font-black'>Sản phẩm tiêu biểu</th>
                    <th className='pb-4 font-black'>Khách hàng</th>
                    <th className='pb-4 font-black'>Ngày đặt</th>
                    <th className='pb-4 font-black text-right'>Giá trị</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-zinc-50'>
                  {stats.recentOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className='hover:bg-zinc-50 transition cursor-pointer group'
                    >
                      <td className='py-5 font-bold text-blue-600'>#{order.id.slice(-6).toUpperCase()}</td>
                      <td className='py-5 font-bold text-zinc-800 max-w-[200px] truncate uppercase text-[10px]'>{order.items[0]?.name} {order.items.length > 1 ? `(+${order.items.length - 1})` : ''}</td>
                      <td className='py-5 text-zinc-500 font-bold uppercase text-[10px]'>{order.customer}</td>
                      <td className='py-5 text-zinc-400 text-[10px]'>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                      <td className='py-5 text-right font-black text-zinc-800'>{order.total.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products / Customers Summary */}
          <div className='space-y-8'>
            {/* Quick Analytics Card */}
            <div className='bg-white rounded-3xl shadow-sm border border-zinc-100 p-8'>
                <h3 className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6'>Biểu đồ doanh thu (30 ngày)</h3>
                <div className='h-48 flex items-end justify-between gap-1 px-2'>
                  {(!stats.chartData || stats.chartData.length === 0) ? (
                    <div className='w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-300 uppercase'>Chưa có dữ liệu</div>
                  ) : (
                    stats.chartData.map((day, i) => {
                      const maxRevenue = Math.max(...stats.chartData.map(d => d.revenue), 1);
                      return (
                        <div key={i} className='flex-1 flex flex-col justify-end h-full group relative'>
                           <div 
                             className='w-full bg-blue-100 group-hover:bg-blue-600 transition-all cursor-pointer rounded-t-sm'
                             style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 5)}%` }}
                           >
                              <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-10'>
                                 {day.revenue.toLocaleString('vi-VN')}đ
                              </div>
                           </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className='mt-6 pt-6 border-t border-zinc-50 flex items-center justify-between'>
                   <span className='text-[10px] font-black uppercase text-zinc-400'>Tỷ lệ tăng trưởng</span>
                   <span className='text-xs font-black text-green-500'>+12.5%</span>
                </div>
            </div>

            {/* Quick Reports Link */}
            <div className='bg-black text-white p-8 rounded-[35px] relative overflow-hidden group cursor-pointer' onClick={() => navigate('/admin/reports')}>
               <div className='relative z-10'>
                  <h3 className='text-[10px] font-black uppercase tracking-widest opacity-40 mb-2'>Báo cáo chi tiết</h3>
                  <p className='text-sm leading-relaxed font-bold'>Xem phân tích chuyên sâu về doanh thu và hiệu quả sản phẩm.</p>
                  <div className='mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest'>
                     Khám phá ngay 
                     <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 8l4 4m0 0l-4 4m4-4H3'/></svg>
                  </div>
               </div>
               <div className='absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform'>
                  <svg className='w-40 h-40' fill='currentColor' viewBox='0 0 24 24'><path d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/></svg>
               </div>
            </div>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md'>
          <div className='bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300'>
            {/* Modal Header */}
            <div className='p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50'>
              <div>
                <h2 className='text-2xl font-black uppercase tracking-tighter'>Đơn hàng #{selectedOrder.id.slice(-6).toUpperCase()}</h2>
                <p className='text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1'>
                  {new Date(selectedOrder.date).toLocaleDateString('vi-VN')} | {new Date(selectedOrder.date).toLocaleTimeString('vi-VN')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className='w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-zinc-50 transition-all hover:rotate-90 active:scale-95 border border-zinc-100'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
            </div>

            <div className='p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar'>
               {/* Items List */}
               <div className='space-y-4'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='w-1 h-4 bg-black rounded-full' />
                    <h3 className='text-xs font-black uppercase tracking-widest text-black'>Danh sách sản phẩm</h3>
                  </div>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className='flex items-center gap-6 bg-zinc-50/80 p-4 rounded-3xl border border-zinc-100 group hover:border-black transition-all'>
                       <div className='w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm p-2'>
                          <img src={item.image} alt={item.name} className='w-full h-full object-contain group-hover:scale-110 transition-all duration-700' />
                       </div>
                       <div className='flex-1'>
                          <p className='text-sm font-black leading-tight uppercase'>{item.name}</p>
                          <div className='flex items-center gap-4 mt-2'>
                             <span className='text-[10px] font-bold text-zinc-400 uppercase'>Số lượng: {item.quantity}</span>
                             <span className='text-[10px] font-bold text-zinc-400 uppercase'>Giá: {item.price.toLocaleString('vi-VN')}đ</span>
                          </div>
                       </div>
                       <div className='text-sm font-black tracking-tighter'>{(item.quantity * item.price).toLocaleString('vi-VN')}đ</div>
                    </div>
                  ))}
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pt-4'>
                  {/* Shipping Info */}
                  <div className='bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100'>
                    <h3 className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4'>Thông tin khách hàng</h3>
                    <div className='space-y-1'>
                      <p className='text-sm font-black uppercase'>{selectedOrder.shippingInfo?.fullName || selectedOrder.customer}</p>
                      <p className='text-xs font-bold text-zinc-500'>{selectedOrder.shippingInfo?.phone}</p>
                      <p className='text-xs text-zinc-400 mt-2 leading-relaxed'>
                        {selectedOrder.shippingInfo?.street}, {selectedOrder.shippingInfo?.ward}, <br/>
                        {selectedOrder.shippingInfo?.district}, {selectedOrder.shippingInfo?.city}
                      </p>
                    </div>
                  </div>

                  {/* Payment & Status */}
                  <div className='bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100'>
                    <h3 className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4'>Thanh toán & Trạng thái</h3>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-[10px] font-bold text-zinc-500 uppercase'>Phương thức:</span>
                        <span className='text-[10px] font-black uppercase bg-white px-3 py-1 rounded-full shadow-sm'>{selectedOrder.paymentMethod || 'COD'}</span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-[10px] font-bold text-zinc-500 uppercase'>Trạng thái:</span>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
                          selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className='p-8 bg-black text-white flex items-center justify-between relative overflow-hidden'>
               {/* Background Swoosh */}
               <div className='absolute right-0 top-0 opacity-10 -mr-10 -mt-10'>
                  <svg className='w-40 h-40 fill-white' viewBox='0 0 192.756 192.756'><path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' /></svg>
               </div>
               
               <div className='relative z-10'>
                  <p className='text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1'>Tổng thanh toán</p>
                  <p className='text-4xl font-black tracking-tighter'>{selectedOrder.total.toLocaleString('vi-VN')}đ</p>
               </div>

               <button 
                onClick={() => setSelectedOrder(null)}
                className='relative z-10 bg-white text-black font-black px-8 py-3 rounded-full text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95'
               >
                 Đóng
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
