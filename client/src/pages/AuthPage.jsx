import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import googleIcon from '../assets/google-icon-logo-svgrepo-com.svg';
import { useUser, useClerk } from '@clerk/react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, googleLogin, user, loading, error, clearError } = useAuthStore();
  const { user: clerkUser, isSignedIn } = useUser();
  const clerk = useClerk();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [googleLoading, setGoogleLoading] = useState(false);

  // Nếu đã login backend → về home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Sau khi Google redirect trở lại → sync với backend
  useEffect(() => {
    const pendingGoogle = sessionStorage.getItem('nike_google_pending');
    if (pendingGoogle && isSignedIn && clerkUser && !user) {
      const email = clerkUser.primaryEmailAddress?.emailAddress;
      const name = clerkUser.fullName || clerkUser.firstName || '';
      const avatar = clerkUser.imageUrl || '';

      if (email) {
        sessionStorage.removeItem('nike_google_pending');
        setGoogleLoading(true);
        googleLogin(email, name, avatar).then((result) => {
          setGoogleLoading(false);
          if (result.success) {
            toast.success('Đăng nhập Google thành công!');
            navigate('/');
          }
        });
      }
    }
  }, [isSignedIn, clerkUser]);

  const handleGoogleSignIn = async () => {
    try {
      // Đăng xuất phiên Clerk cũ để user có thể chọn tài khoản Google khác
      if (isSignedIn) {
        await clerk.signOut();
      }
      // Đánh dấu đang chờ Google
      sessionStorage.setItem('nike_google_pending', 'true');

      // Tạo phiên sign-in mới với Google OAuth
      const si = await clerk.client.signIn.create({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/sso-callback',
        actionCompleteRedirectUrl: window.location.origin + '/auth',
      });

      // Lấy URL redirect từ Google và chuyển hướng
      const redirectUrl = si.firstFactorVerification.externalVerificationRedirectURL;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err) {
      sessionStorage.removeItem('nike_google_pending');
      console.error('Google sign-in error:', err);
      toast.error('Không thể kết nối Google. Vui lòng thử lại.');
    }
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Vui lòng nhập email';
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu';
    if (!isLogin) {
      if (!form.name) errs.name = 'Vui lòng nhập họ tên';
      if (form.password !== form.confirm)
        errs.confirm = 'Mật khẩu xác nhận không khớp';
      if (form.password && form.password.length < 6)
        errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);

    if (result.success) {
      toast.success(isLogin ? 'Đăng nhập thành công!' : 'Đăng ký thành công!');
      navigate('/');
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm outline-none transition ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-zinc-300 focus:border-black'
    }`;

  return (
    <div className='min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <svg
            className='w-16 h-16 fill-black mx-auto mb-4'
            viewBox='0 0 192.756 192.756'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' />
          </svg>
          <h1 className='text-3xl font-black uppercase tracking-widest'>
            Nike Football
          </h1>
          <p className='text-zinc-500 text-sm mt-2 font-medium'>
            {isLogin ? 'Chào mừng bạn trở lại.' : 'Trở thành thành viên của Nike.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className='flex bg-zinc-200 rounded-full p-1 mb-6'>
          {['Đăng nhập', 'Đăng ký'].map((label, i) => (
            <button
              key={label}
              onClick={() => {
                setIsLogin(i === 0);
                setErrors({});
              }}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${
                isLogin === (i === 0)
                  ? 'bg-white text-black shadow'
                  : 'text-zinc-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-2xl shadow-sm p-8 space-y-4'
        >
          {!isLogin && (
            <div>
              <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
                Họ và tên
              </label>
              <input
                name='name'
                placeholder='Nguyễn Văn A'
                value={form.name}
                onChange={handleChange}
                className={inputClass('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
              Email
            </label>
            <input
              name='email'
              type='email'
              placeholder='example@gmail.com'
              value={form.email}
              onChange={handleChange}
              className={inputClass('email')}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>

          <div>
            <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
              Mật khẩu
            </label>
            <input
              name='password'
              type='password'
              placeholder='••••••••'
              value={form.password}
              onChange={handleChange}
              className={inputClass('password')}
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className='text-xs font-bold uppercase tracking-wide text-zinc-500 mb-1.5 block'>
                Xác nhận mật khẩu
              </label>
              <input
                name='confirm'
                type='password'
                placeholder='••••••••'
                value={form.confirm}
                onChange={handleChange}
                className={inputClass('confirm')}
              />
              {errors.confirm && (
                <p className='text-red-500 text-xs mt-1'>{errors.confirm}</p>
              )}
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white font-black py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-800 transition disabled:opacity-50 mt-2'
          >
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng ký'}
          </button>

          {/* OR Divider */}
          <div className='flex items-center gap-4 py-2'>
            <div className='flex-1 h-px bg-zinc-200' />
            <span className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>Hoặc</span>
            <div className='flex-1 h-px bg-zinc-200' />
          </div>

          {/* Google Button - Clerk */}
          <button
            type='button'
            onClick={handleGoogleSignIn}
            disabled={loading}
            className='w-full border-2 border-zinc-200 text-black font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-3 hover:bg-zinc-50 hover:border-zinc-300 transition disabled:opacity-50'
          >
            <img src={googleIcon} alt="Google" className='w-5 h-5' />
            Tiếp tục với Google
          </button>

          <div className='text-center pt-2'>
            <button
              type='button'
              onClick={() => navigate('/shop')}
              className='text-blue-600 hover:text-blue-800 transition text-sm font-medium underline underline-offset-4'
            >
              Quay lại và tiếp tục mua hàng
            </button>
          </div>
        </form>

        <p className='text-center text-sm text-zinc-400 mt-4'>
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className='text-black font-bold hover:underline'
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  );
}
