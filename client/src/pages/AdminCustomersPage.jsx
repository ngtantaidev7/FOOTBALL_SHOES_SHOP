import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getAdminStatsAPI, getCustomerInsightsAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminCustomersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCustomers();
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStatsAPI();
      setStats(data.data);
    } catch (err) {}
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await getCustomerInsightsAPI();
      setCustomers(data.data);
    } catch (err) {
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#F0F2F5] flex'>
       <AdminSidebar stats={stats} />

      <main className='flex-1 p-8'>
         <div className='flex items-center justify-between mb-10'>
            <div>
               <h1 className='text-3xl font-black uppercase tracking-tighter'>Quản lý khách hàng</h1>
               <p className='text-zinc-500'>Xem chi tiết hành vi mua sắm và giá trị vòng đời khách hàng.</p>
            </div>
            <div className='flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm'>
               <div className='text-right'>
                  <p className='text-[10px] font-black uppercase text-zinc-400'>Tổng khách hàng</p>
                  <p className='text-xl font-black'>{customers.length}</p>
               </div>
               <div className='w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-xl'>👥</div>
            </div>
         </div>
         
         <div className='bg-white rounded-[40px] shadow-sm border border-zinc-100 overflow-hidden'>
            <table className='w-full text-left text-sm'>
               <thead>
                 <tr className='bg-zinc-50 text-zinc-400 uppercase text-[10px] tracking-widest border-b border-zinc-100'>
                   <th className='px-8 py-5 font-black'>Khách hàng</th>
                   <th className='px-8 py-5 font-black'>Thông tin liên hệ</th>
                   <th className='px-8 py-5 font-black text-center'>Số đơn hàng</th>
                   <th className='px-8 py-5 font-black text-center'>Tổng chi tiêu</th>
                   <th className='px-8 py-5 font-black'>Lần cuối mua</th>
                   <th className='px-8 py-5 font-black text-right'>Hành động</th>
                 </tr>
               </thead>
               <tbody className='divide-y divide-zinc-50'>
                 {loading ? (
                    <tr><td colSpan={6} className='py-20 text-center text-zinc-400 font-bold uppercase tracking-widest animate-pulse'>Đang tải dữ liệu...</td></tr>
                 ) : customers.length === 0 ? (
                    <tr><td colSpan={6} className='py-20 text-center text-zinc-400 font-bold uppercase tracking-widest'>Chưa có dữ liệu khách hàng</td></tr>
                 ) : (
                    customers.map(customer => (
                      <tr key={customer._id} className='hover:bg-zinc-50 transition group'>
                        <td className='px-8 py-6'>
                           <div className='flex items-center gap-4'>
                              <div className='w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm relative overflow-hidden'>
                                 {customer.avatar ? (
                                    <img src={customer.avatar} className='w-full h-full object-cover' />
                                 ) : (
                                    customer.name.charAt(0)
                                 )}
                                 {customer.role === 'admin' && (
                                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full' />
                                 )}
                              </div>
                              <div>
                                 <span className='font-black text-zinc-800 uppercase text-xs block'>{customer.name}</span>
                                 <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${customer.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                                    {customer.role}
                                 </span>
                              </div>
                           </div>
                        </td>
                        <td className='px-8 py-6 text-zinc-500 font-bold text-xs'>{customer.email}</td>
                        <td className='px-8 py-6 text-center font-black text-zinc-800'>{customer.orderCount}</td>
                        <td className='px-8 py-6 text-center font-black text-blue-600'>{customer.totalSpent.toLocaleString('vi-VN')}đ</td>
                        <td className='px-8 py-6 text-zinc-400 text-[10px] font-bold'>
                           {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className='px-8 py-6 text-right'>
                           <button className='text-zinc-300 hover:text-black transition p-2'>
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/></svg>
                           </button>
                        </td>
                      </tr>
                    ))
                 )}
               </tbody>
            </table>
         </div>
      </main>
    </div>
  );
}
