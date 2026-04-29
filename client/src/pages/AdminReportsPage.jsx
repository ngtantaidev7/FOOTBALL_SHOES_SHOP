import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getDetailedReportsAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminReportsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
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

      setStats(statsRes.data.data);
      setReports({
        ...reportsRes.data.data,
        salesByDay: filledData
      });
    } catch (err) {
      toast.error('Không thể tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = reports?.salesByDay?.reduce((max, day) => Math.max(max, day.revenue), 0) || 1;

  return (
    <div className='min-h-screen bg-[#F0F2F5] flex'>
       <AdminSidebar stats={stats} />

      <main className='flex-1 p-8 overflow-y-auto'>
         <div className='flex items-center justify-between mb-10'>
            <div>
               <h1 className='text-3xl font-black uppercase tracking-tighter'>Báo cáo doanh thu</h1>
               <p className='text-zinc-500'>Phân tích hiệu quả kinh doanh và sản phẩm bán chạy.</p>
            </div>
            <button 
              onClick={fetchData}
              className='bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm hover:bg-zinc-50 transition'
            >
               <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'/></svg>
            </button>
         </div>

         {loading ? (
            <div className='py-20 text-center font-black uppercase tracking-widest animate-pulse text-zinc-400'>Đang tổng hợp dữ liệu...</div>
         ) : (
            <div className='space-y-10'>
               {/* Sales Chart */}
               <div className='bg-white p-10 rounded-[40px] border border-zinc-100 shadow-sm'>
                  <div className='flex items-center justify-between mb-12'>
                     <div>
                        <h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2'>Doanh thu 30 ngày qua</h3>
                        <p className='text-4xl font-black tracking-tighter'>{stats?.revenue?.month?.toLocaleString('vi-VN')}đ</p>
                     </div>
                     <div className='flex gap-2'>
                        <div className='px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest'>Tăng trưởng 12%</div>
                     </div>
                  </div>

                  <div className='h-64 flex items-end gap-2 bg-zinc-50/50 rounded-2xl p-4 border border-zinc-50'>
                     {!reports?.salesByDay || reports.salesByDay.length === 0 ? (
                        <div className='w-full h-full flex items-center justify-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest'>
                           Chưa có dữ liệu giao dịch trong 30 ngày qua
                        </div>
                     ) : (
                        reports?.salesByDay?.map((day, idx) => (
                           <div key={idx} className='flex-1 group relative h-full flex flex-col justify-end'>
                              <div 
                                className='w-full bg-blue-600/20 group-hover:bg-blue-600 transition-all rounded-t-lg relative border-b-2 border-blue-600/30'
                                style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 5)}%` }}
                              >
                                 <div className='absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20'>
                                    {day.revenue.toLocaleString('vi-VN')}đ
                                 </div>
                              </div>
                              <div className='absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-zinc-300 uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all'>
                                 {day._id.split('-').slice(1).join('/')}
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>

               <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                  {/* Top Products */}
                  <div className='bg-white p-10 rounded-[40px] border border-zinc-100 shadow-sm'>
                     <h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-8'>Sản phẩm bán chạy</h3>
                     <div className='space-y-6'>
                        {reports?.topProducts?.map((p, idx) => (
                           <div key={idx} className='flex items-center gap-6 group'>
                              <div className='w-16 h-16 bg-zinc-50 rounded-2xl p-2 border border-zinc-100 overflow-hidden shrink-0'>
                                 <img src={p.image} className='w-full h-full object-contain group-hover:scale-110 transition-transform' />
                              </div>
                              <div className='flex-1 min-w-0'>
                                 <p className='text-xs font-black uppercase truncate'>{p.name}</p>
                                 <p className='text-[10px] text-zinc-400 font-bold uppercase mt-1'>{p.totalQty} Đã bán</p>
                              </div>
                              <div className='text-right'>
                                 <p className='text-sm font-black'>{p.totalRevenue.toLocaleString('vi-VN')}đ</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Other Stats */}
                  <div className='space-y-10'>
                     <div className='bg-black text-white p-10 rounded-[40px] relative overflow-hidden group'>
                        <div className='relative z-10'>
                           <h3 className='text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2'>Giá trị đơn trung bình</h3>
                           <p className='text-5xl font-black tracking-tighter'>
                              {stats?.orders?.total > 0 
                                ? Math.round(stats?.revenue?.year / stats?.orders?.total).toLocaleString('vi-VN') 
                                : 0}đ
                           </p>
                           <p className='text-[10px] font-black uppercase tracking-widest mt-4 opacity-60'>Tối ưu hoá giỏ hàng hiệu quả</p>
                        </div>
                        <svg className='absolute -right-10 -bottom-10 w-64 h-64 opacity-5 group-hover:scale-110 transition-transform' fill='currentColor' viewBox='0 0 24 24'><path d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/></svg>
                     </div>

                     <div className='grid grid-cols-2 gap-10'>
                        <div className='bg-white p-8 rounded-[40px] border border-zinc-100'>
                           <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2'>Đơn hàng năm</p>
                           <p className='text-2xl font-black'>{stats?.orders?.total}</p>
                        </div>
                        <div className='bg-white p-8 rounded-[40px] border border-zinc-100'>
                           <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2'>Tổng khách</p>
                           <p className='text-2xl font-black'>{stats?.customers}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </main>
    </div>
  );
}
