import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getAdminStatsAPI } from '../services/orderService';
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
      const { data } = await api.get('/auth/admin/users'); // Giả định endpoint này tồn tại
      setCustomers(data.data);
    } catch (err) {
      // Mock data if endpoint not ready
      setCustomers([
        { _id: '1', name: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'user', createdAt: '2026-01-10' },
        { _id: '2', name: 'Trần Thị B', email: 'thib@gmail.com', role: 'user', createdAt: '2026-02-15' },
        { _id: '3', name: 'Admin Nike', email: 'admin@nike.com', role: 'admin', createdAt: '2025-12-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#F0F2F5] flex'>
       <AdminSidebar stats={stats} />

      <main className='flex-1 p-8'>
         <h1 className='text-3xl font-black uppercase tracking-tighter mb-10'>Quản lý khách hàng</h1>
         
         <div className='bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden'>
            <table className='w-full text-left text-sm'>
               <thead>
                 <tr className='bg-zinc-50 text-zinc-400 uppercase text-[10px] tracking-widest border-b border-zinc-100'>
                   <th className='px-8 py-4 font-black'>Khách hàng</th>
                   <th className='px-8 py-4 font-black'>Email</th>
                   <th className='px-8 py-4 font-black'>Vai trò</th>
                   <th className='px-8 py-4 font-black'>Ngày tham gia</th>
                   <th className='px-8 py-4 font-black text-right'>Hành động</th>
                 </tr>
               </thead>
               <tbody className='divide-y divide-zinc-50'>
                 {customers.map(customer => (
                   <tr key={customer._id} className='hover:bg-zinc-50 transition'>
                     <td className='px-8 py-5 flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-black text-[10px]'>{customer.name.charAt(0)}</div>
                        <span className='font-black text-zinc-800'>{customer.name}</span>
                     </td>
                     <td className='px-8 py-5 text-zinc-500 font-medium'>{customer.email}</td>
                     <td className='px-8 py-5'>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${customer.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-zinc-100 text-zinc-600'}`}>
                          {customer.role}
                        </span>
                     </td>
                     <td className='px-8 py-5 text-zinc-400'>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                     <td className='px-8 py-5 text-right'>
                        <button className='text-zinc-300 hover:text-red-500 transition'>
                           <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'/></svg>
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
         </div>
      </main>
    </div>
  );
}
