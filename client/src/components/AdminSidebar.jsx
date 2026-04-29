import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function AdminSidebar({ stats }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { label: 'Báo cáo', path: '/admin/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Đơn hàng', path: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', badge: stats?.orders?.total },
    { label: 'Sản phẩm', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Khách hàng', path: '/admin/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  return (
    <aside className='w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto'>
      <div className='p-6 border-b border-zinc-100 flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold'>
          {user?.name?.charAt(0)}
        </div>
        <div>
          <p className='text-sm font-black uppercase tracking-tight'>{user?.name}</p>
          <p className='text-[10px] text-zinc-400 font-bold uppercase'>Administrator</p>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-2'>
        <p className='text-[10px] font-black text-zinc-400 uppercase tracking-widest px-4 mb-4 mt-2'>Hệ thống</p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                isActive ? 'bg-zinc-100 text-black shadow-sm' : 'text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              <div className='flex items-center gap-3'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d={item.icon} />
                </svg>
                <span className='text-sm font-bold'>{item.label}</span>
              </div>
              {item.badge && (
                <span className='bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md'>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className='p-4 border-t border-zinc-100'>
         <button 
           onClick={() => navigate('/shop')}
           className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition'
         >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M10 19l-7-7m0 0l7-7m-7 7h18'/></svg>
            <span className='text-sm font-bold'>Về cửa hàng</span>
         </button>
      </div>
    </aside>
  );
}
