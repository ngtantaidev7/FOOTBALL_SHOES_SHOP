import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import CartDrawer from './CartDrawer';
import { motion } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { items } = useCartStore();
  const { user, logout } = useAuthStore();

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  // Listen for global open-cart event
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoHome = (e) => {
    // If we're already on home, just scroll to top
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on another page, navigate to home and then scroll
      // React Router usually scrolls to top on navigation, 
      // but smooth scroll is better if requested.
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className='bg-black text-white sticky top-0 z-50 shadow-lg'>
      {/* Top bar */}
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4'>
        {/* Logo */}
        <Link to='/' onClick={handleGoHome} className='flex items-center gap-2 shrink-0'>
          <svg className='w-12 h-12 fill-white' viewBox='0 0 192.756 192.756' xmlns='http://www.w3.org/2000/svg'>
            <path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' />
          </svg>
          <span className='text-xl font-black tracking-widest uppercase hidden sm:block'>
            Nike Football
          </span>
        </Link>

        {/* Search */}
        <div className='flex-1 max-w-md relative'>
          <input
            type='text'
            placeholder='Tìm kiếm giày...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className='w-full bg-zinc-800 text-white placeholder-zinc-400 rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-white transition'
          />
          <svg
            className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
        </div>

        {/* Nav desktop */}
        <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
          <Link to='/' onClick={handleGoHome} className='hover:text-zinc-300 transition py-4'>
            Trang chủ
          </Link>
          
          {/* Shop Dropdown */}
          <div className='relative group py-4'>
            <Link to='/shop' className='hover:text-zinc-300 transition flex items-center gap-1'>
              Cửa hàng
              <svg className='w-3 h-3 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'/></svg>
            </Link>
            
            {/* Mega Menu */}
            <div className='absolute top-full left-1/2 -translate-x-1/2 w-[550px] bg-white text-black shadow-2xl rounded-2xl p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0'>
              <div className='grid grid-cols-3 gap-8'>
                <div>
                  <h4 className='font-black uppercase mb-4 text-xs text-zinc-400 tracking-widest'>Phân Khúc</h4>
                  <ul className='space-y-3 text-sm font-bold'>
                    <li><Link to='/shop?tier=Elite' className='hover:text-blue-600 transition block'>Elite</Link></li>
                    <li><Link to='/shop?tier=Pro' className='hover:text-blue-600 transition block'>Pro</Link></li>
                    <li><Link to='/shop?tier=Academy' className='hover:text-blue-600 transition block'>Academy</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-black uppercase mb-4 text-xs text-zinc-400 tracking-widest'>Loại Sân</h4>
                  <ul className='space-y-3 text-sm font-bold'>
                    <li><Link to='/shop?surfaceType=FG' className='hover:text-blue-600 transition block'>FG (Tự nhiên)</Link></li>
                    <li><Link to='/shop?surfaceType=AG' className='hover:text-blue-600 transition block'>AG (Nhân tạo)</Link></li>
                    <li><Link to='/shop?surfaceType=TF' className='hover:text-blue-600 transition block'>TF (Sân cứng)</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-black uppercase mb-4 text-xs text-zinc-400 tracking-widest'>Dòng Giày</h4>
                  <ul className='space-y-3 text-sm font-bold'>
                    <li><Link to='/shop?category=Mercurial' className='hover:text-blue-600 transition block'>Mercurial</Link></li>
                    <li><Link to='/shop?category=Phantom' className='hover:text-blue-600 transition block'>Phantom</Link></li>
                    <li><Link to='/shop?category=Tiempo' className='hover:text-blue-600 transition block'>Tiempo</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Link to='/about' className='hover:text-zinc-300 transition py-4'>
            Về chúng tôi
          </Link>
        </nav>

        {/* Right actions */}
        <div className='flex items-center gap-3'>
          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className='relative p-2 hover:bg-zinc-800 rounded-full transition'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
              <line x1='3' y1='6' x2='21' y2='6' />
              <path d='M16 10a4 4 0 0 1-8 0' />
            </svg>
            {totalQty > 0 && (
              <motion.span 
                key={totalQty}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-black'
              >
                {totalQty > 99 ? '99+' : totalQty}
              </motion.span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className='relative group'>
              <button className='flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 text-sm hover:bg-zinc-700 transition'>
                <div className='w-6 h-6 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs'>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className='hidden sm:block max-w-[80px] truncate'>
                  {user.name}
                </span>
              </button>
              {/* Dropdown */}
              <div className='absolute right-0 mt-3 w-56 bg-white text-black rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-zinc-100'>
                <div className='px-4 py-3 border-b border-zinc-50 bg-zinc-50/50'>
                   <p className='text-[10px] font-black uppercase text-zinc-400 tracking-widest'>Tài khoản của tôi</p>
                   <p className='text-sm font-black truncate'>{user.name}</p>
                </div>
                
                <div className='p-1.5'>
                  {user.role === 'admin' && (
                    <Link
                      to='/admin/dashboard'
                      className='flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition'
                    >
                      <div className='w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </div>
                      Quản trị (Dashboard)
                    </Link>
                  )}
                  <Link
                    to='/account'
                    className='flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition'
                  >
                    <div className='w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    to='/orders'
                    className='flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition'
                  >
                    <div className='w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    Đơn hàng đã mua
                  </Link>
                </div>

                <div className='p-1.5 border-t border-zinc-50 bg-zinc-50/30'>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition'
                  >
                    <div className='w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </div>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to='/auth'
              className='bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-zinc-200 transition'
            >
              Đăng nhập
            </Link>
          )}

          {/* Hamburger mobile */}
          <button
            className='md:hidden p-2 hover:bg-zinc-800 rounded-full transition'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              {menuOpen ? (
                <path d='M6 18 18 6M6 6l12 12' />
              ) : (
                <path d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className='md:hidden bg-zinc-900 px-4 pb-4 flex flex-col gap-3 text-sm font-medium'>
          <Link
            to='/'
            onClick={(e) => {
              setMenuOpen(false);
              handleGoHome(e);
            }}
            className='py-2 border-b border-zinc-700'
          >
            Trang chủ
          </Link>
          <Link
            to='/shop'
            onClick={() => setMenuOpen(false)}
            className='py-2 border-b border-zinc-700'
          >
            Cửa hàng
          </Link>
          <Link to='/about' onClick={() => setMenuOpen(false)} className='py-2'>
            Về chúng tôi
          </Link>
        </div>
      )}

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
