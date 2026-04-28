import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Fetch orders to calculate stats
    api.get('/orders/my')
      .then((res) => {
        const orders = res.data.data;
        setStats({
          total: orders.length,
          pending: orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length,
          completed: orders.filter(o => o.orderStatus === 'delivered').length,
        });
      })
      .catch(err => console.error(err));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className='min-h-screen bg-[#F5F5F5] pb-20'>
      {/* Hero Banner */}
      <div className='bg-black py-16 px-6 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10 bg-[url("https://www.transparenttextures.com/patterns/carbon-fibre.png")]'></div>
        <div className='max-w-4xl mx-auto relative z-10'>
          <h1 className='text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] inline-block relative'>
            TÀI KHOẢN CỦA TÔI
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              className='h-1.5 bg-[#E5000A] absolute -bottom-4 left-0'
            />
          </h1>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-6 -mt-10 relative z-20'>
        <div className='grid grid-cols-1 gap-8'>
          
          {/* User Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-2xl shadow-xl border-l-[6px] border-[#E5000A] p-8 md:p-10'
          >
            <div className='flex flex-col md:flex-row items-center gap-8'>
              {/* Avatar */}
              <div className='w-32 h-32 rounded-full bg-gradient-to-br from-zinc-900 to-[#E5000A] flex items-center justify-center text-5xl font-black text-white shadow-2xl shrink-0'>
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div className='text-center md:text-left flex-1'>
                <h2 className='text-3xl font-black uppercase tracking-tight text-zinc-900'>{user.name}</h2>
                <p className='text-zinc-400 font-medium mt-1'>{user.email}</p>
                <div className='mt-4 flex flex-wrap justify-center md:justify-start gap-3'>
                  <span className='border-2 border-zinc-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500'>
                    VAI TRÒ: {user.role}
                  </span>
                  {user.role === 'admin' && (
                    <Link to='/admin/dashboard' className='bg-zinc-100 hover:bg-black hover:text-white transition-all px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest'>
                      Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className='grid grid-cols-3 gap-4 mt-12 pt-10 border-t border-zinc-100 text-center'>
               <div>
                  <p className='text-3xl font-black text-black'>{stats.total}</p>
                  <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2'>Tổng đơn hàng</p>
               </div>
               <div className='border-x border-zinc-100'>
                  <p className='text-3xl font-black text-[#E5000A]'>{stats.pending}</p>
                  <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2'>Đang xử lý</p>
               </div>
               <div>
                  <p className='text-3xl font-black text-green-600'>{stats.completed}</p>
                  <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2'>Hoàn thành</p>
               </div>
            </div>
          </motion.div>

          {/* Shipping Address Section */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3 px-2'>
              <span className='text-2xl'>📍</span>
              <h3 className='text-lg font-black uppercase tracking-widest text-zinc-800'>Địa chỉ giao hàng</h3>
            </div>

            {user.addresses && user.addresses.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {user.addresses.map((addr, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className='bg-white p-6 rounded-2xl shadow-md border-l-4 border-zinc-200 relative group'
                  >
                    {addr.isDefault && (
                      <span className='absolute top-4 right-4 bg-black text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest'>Mặc định</span>
                    )}
                    <p className='font-black text-zinc-900 uppercase text-sm mb-1'>{addr.fullName}</p>
                    <p className='text-xs font-bold text-zinc-400 mb-4'>{addr.phone}</p>
                    <p className='text-xs text-zinc-500 leading-relaxed font-medium'>
                      {addr.street}, {addr.ward}<br/>
                      {addr.district}, {addr.city}
                    </p>
                    <div className='mt-6 pt-4 border-t border-zinc-50 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                       <button className='text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline'>Chỉnh sửa</button>
                       <button className='text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline'>Xóa</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className='bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center'>
                <div className='w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <p className='text-zinc-400 font-bold text-sm mb-6'>Bạn chưa lưu địa chỉ giao hàng nào.</p>
                <button className='bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg'>Thêm địa chỉ mới</button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 pt-8'>
            <button 
              onClick={() => navigate('/orders')}
              className='flex-1 bg-black text-white font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all hover:shadow-2xl active:scale-95'
            >
              Xem danh sách đơn hàng
            </button>
            <button 
              onClick={logout}
              className='flex-1 border-2 border-[#E5000A] text-[#E5000A] font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-[#E5000A] hover:text-white transition-all active:scale-95'
            >
              Đăng xuất khỏi hệ thống
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
