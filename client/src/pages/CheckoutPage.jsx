import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { createOrderAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const PAYMENT_METHODS = [
  {
    value: 'cod',
    label: 'Thanh toán khi nhận hàng',
    sub: 'Thanh toán bằng tiền mặt khi giao hàng',
    icon: '💵'
  },
  {
    value: 'qr_code',
    label: 'Chuyển khoản QR (VietQR)',
    sub: 'Quét mã QR để chuyển khoản nhanh 24/7',
    icon: '📸'
  },
];

const API_PROVINCES = 'https://provinces.open-api.vn/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, totalPrice, updateQty, removeItem } = useCartStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment & Review
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    street: '',
    note: '',
  });

  // Address selectors
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const total = totalPrice();
  const shippingFee = total >= 1_500_000 ? 0 : 30_000;
  const grandTotal = total + shippingFee;

  // ── Fetch tỉnh/thành phố ──────────────────────────────────────
  useEffect(() => {
    fetch(`${API_PROVINCES}/p/`)
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => toast.error('Không thể tải danh sách tỉnh/thành phố'));
  }, []);

  // ── Fetch quận/huyện khi chọn tỉnh ────────────────────────────
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedWard('');
      return;
    }
    fetch(`${API_PROVINCES}/p/${selectedProvince}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data.districts || []);
        setSelectedDistrict('');
        setWards([]);
        setSelectedWard('');
      })
      .catch(() => toast.error('Không thể tải danh sách quận/huyện'));
  }, [selectedProvince]);

  // ── Fetch phường/xã khi chọn quận ─────────────────────────────
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard('');
      return;
    }
    fetch(`${API_PROVINCES}/d/${selectedDistrict}?depth=2`)
      .then((res) => res.json())
      .then((data) => {
        setWards(data.wards || []);
        setSelectedWard('');
      })
      .catch(() => toast.error('Không thể tải danh sách phường/xã'));
  }, [selectedDistrict]);

  // ── Helper: lấy tên từ code ───────────────────────────────────
  const getProvinceName = () => provinces.find((p) => p.code == selectedProvince)?.name || '';
  const getDistrictName = () => districts.find((d) => d.code == selectedDistrict)?.name || '';
  const getWardName = () => wards.find((w) => w.code == selectedWard)?.name || '';

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validateShipping = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email';
    if (!form.street.trim()) errs.street = 'Vui lòng nhập địa chỉ cụ thể';
    if (!selectedProvince) errs.city = 'Vui lòng chọn tỉnh thành';
    if (!selectedDistrict) errs.district = 'Vui lòng chọn quận huyện';
    if (!selectedWard) errs.ward = 'Vui lòng chọn phường xã';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateShipping()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate premium processing delay
    setTimeout(async () => {
      try {
        const orderItems = items.map((i) => ({
          product: i._id,
          size: i.selectedSize,
          quantity: i.quantity,
        }));
        const { data } = await createOrderAPI({
          items: orderItems,
          shippingInfo: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            street: form.street,
            ward: getWardName(),
            district: getDistrictName(),
            city: getProvinceName(),
          },
          paymentMethod,
          note: form.note,
        });
        clearCart();
        toast.success('Xác nhận đơn hàng thành công!');
        navigate(`/orders/${data.data._id}`);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const inputClass = (field) =>
    `w-full bg-zinc-50 border-2 rounded-2xl px-5 py-4 text-sm outline-none transition-all duration-300 ${
      errors[field] ? 'border-red-400 bg-red-50/30' : 'border-zinc-100 focus:border-black focus:bg-white focus:shadow-inner'
    }`;

  const selectClass = (field) =>
    `w-full bg-zinc-50 border-2 rounded-2xl px-5 py-4 text-sm outline-none transition-all duration-300 appearance-none cursor-pointer ${
      errors[field] ? 'border-red-400 bg-red-50/30' : 'border-zinc-100 focus:border-black focus:bg-white focus:shadow-inner'
    }`;

  if (items.length === 0) {
    return (
      <div className='min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-white'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className='w-40 h-40 bg-zinc-50 rounded-full flex items-center justify-center mb-10'
        >
          <svg className="w-20 h-20 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </motion.div>
        <h2 className='text-4xl font-black mb-6 uppercase tracking-tighter'>Túi đồ của bạn trống</h2>
        <p className='text-zinc-500 mb-12 max-w-sm mx-auto leading-relaxed font-medium'>
          Đừng bỏ lỡ những siêu phẩm mới nhất. Hãy quay lại cửa hàng và chọn cho mình một đôi giày ưng ý.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className='bg-black text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-2xl'
        >
          Bắt đầu mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#f5f5f7] pb-32'>
      {/* Premium Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white p-6 text-center'
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className='w-16 h-16 border-4 border-white/20 border-t-white rounded-full mb-8'
            />
            <h3 className='text-3xl font-black uppercase tracking-tighter mb-4'>Đang xử lý đơn hàng</h3>
            <p className='text-zinc-400 font-medium max-w-xs'>Vui lòng giữ kết nối, chúng tôi đang chuẩn bị "vũ khí" cho bạn.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className='bg-white border-b border-zinc-200 sticky top-0 z-40 px-4'>
        <div className='max-w-6xl mx-auto flex justify-between h-20 items-center'>
          {[
            { id: 1, label: 'Thông tin' },
            { id: 2, label: 'Thanh toán' },
            { id: 3, label: 'Hoàn tất' }
          ].map((s) => (
            <div key={s.id} className='flex items-center gap-3 group'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${
                step >= s.id ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'
              }`}>
                {s.id}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${
                step >= s.id ? 'text-black' : 'text-zinc-400'
              }`}>
                {s.label}
              </span>
              {s.id < 3 && <div className={`w-12 h-px hidden md:block ${step > s.id ? 'bg-black' : 'bg-zinc-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>

          {/* ── Main Content Area (8 Cols) ──────────────────────── */}
          <div className='lg:col-span-8'>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className='space-y-8'
                >
                  {/* Shipping Info Card */}
                  <div className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100'>
                    <div className='flex items-center justify-between mb-10'>
                      <h2 className='text-2xl font-black uppercase tracking-tighter'>Thông tin nhận hàng</h2>
                      {!user && (
                         <Link to='/auth' className='text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-300 transition'>Đăng nhập</Link>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='md:col-span-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Họ và tên</label>
                        <input name='fullName' value={form.fullName} onChange={handleChange} className={inputClass('fullName')} placeholder="Nguyễn Văn A" />
                        {errors.fullName && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Số điện thoại</label>
                        <input name='phone' value={form.phone} onChange={handleChange} className={inputClass('phone')} placeholder="090 123 4567" />
                        {errors.phone && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.phone}</p>}
                      </div>

                      <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Email</label>
                        <input name='email' type='email' value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="name@example.com" />
                        {errors.email && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.email}</p>}
                      </div>

                      <div className='md:col-span-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Tỉnh / Thành phố</label>
                        <div className='relative'>
                          <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className={selectClass('city')}>
                            <option value=''>Chọn Tỉnh/Thành phố</option>
                            {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                          </select>
                          <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none'>▼</div>
                        </div>
                        {errors.city && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.city}</p>}
                      </div>

                      <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Quận / Huyện</label>
                        <div className='relative'>
                          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince} className={selectClass('district')}>
                            <option value=''>Chọn Quận/Huyện</option>
                            {districts.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
                          </select>
                          <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none'>▼</div>
                        </div>
                        {errors.district && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.district}</p>}
                      </div>

                      <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Phường / Xã</label>
                        <div className='relative'>
                          <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict} className={selectClass('ward')}>
                            <option value=''>Chọn Phường/Xã</option>
                            {wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
                          </select>
                          <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none'>▼</div>
                        </div>
                        {errors.ward && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.ward}</p>}
                      </div>

                      <div className='md:col-span-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block px-1'>Địa chỉ chi tiết</label>
                        <input name='street' value={form.street} onChange={handleChange} className={inputClass('street')} placeholder="Số nhà, tên đường..." />
                        {errors.street && <p className='text-red-500 text-[10px] font-bold mt-2 px-2 uppercase'>{errors.street}</p>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className='w-full bg-black text-white font-black py-6 rounded-[2rem] text-sm uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl'
                  >
                    Tiếp tục thanh toán
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-8'
                >
                  {/* Payment Methods */}
                  <div className='bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100'>
                    <h2 className='text-2xl font-black uppercase tracking-tighter mb-10'>Phương thức thanh toán</h2>
                    <div className='space-y-4'>
                      {PAYMENT_METHODS.map((m) => (
                        <label
                          key={m.value}
                          className={`flex items-center gap-6 border-2 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 ${
                            paymentMethod === m.value
                              ? 'border-black bg-zinc-50'
                              : 'border-zinc-100 hover:border-zinc-300'
                          }`}
                        >
                          <div className='text-3xl'>{m.icon}</div>
                          <div className='flex-1'>
                            <p className='text-sm font-black uppercase tracking-tight'>{m.label}</p>
                            <p className='text-xs text-zinc-400 mt-1 font-medium'>{m.sub}</p>
                          </div>
                          <input
                            type='radio'
                            name='payment'
                            checked={paymentMethod === m.value}
                            onChange={() => setPaymentMethod(m.value)}
                            className='w-6 h-6 accent-black'
                          />
                        </label>
                      ))}
                    </div>

                    {/* QR Code Display Section */}
                    <AnimatePresence>
                      {paymentMethod === 'qr_code' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className='mt-8 pt-8 border-t border-zinc-100 overflow-hidden'
                        >
                          <div className='flex flex-col md:flex-row items-center gap-10 bg-zinc-50 p-8 rounded-[2rem] border border-zinc-100'>
                            <div className='bg-white p-4 rounded-3xl shadow-xl border border-zinc-100'>
                              <QRCodeSVG
                                value={`00020101021138580010A00000072701240006970436011010244601560208QRIBFTTA5204000054${String(grandTotal).length.toString().padStart(2, '0')}${grandTotal}5802VN62180814NIKE_FOOTBALL6304`}
                                size={180}
                                level='H'
                                includeMargin={false}
                                imageSettings={{
                                  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
                                  x: undefined,
                                  y: undefined,
                                  height: 24,
                                  width: 24,
                                  excavate: true,
                                }}
                              />
                            </div>
                            <div className='flex-1 text-center md:text-left'>
                              <p className='text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4'>Thông tin chuyển khoản</p>
                              <div className='space-y-3'>
                                <div className='flex justify-between md:justify-start md:gap-10'>
                                  <span className='text-xs text-zinc-400 font-bold'>Ngân hàng</span>
                                  <span className='text-xs font-black uppercase'>Vietcombank (VCB)</span>
                                </div>
                                <div className='flex justify-between md:justify-start md:gap-10'>
                                  <span className='text-xs text-zinc-400 font-bold'>Số tài khoản</span>
                                  <span className='text-xs font-black'>1024460156</span>
                                </div>
                                <div className='flex justify-between md:justify-start md:gap-10'>
                                  <span className='text-xs text-zinc-400 font-bold'>Chủ tài khoản</span>
                                  <span className='text-xs font-black uppercase'>TRAN NAM MINH KHOA</span>
                                </div>
                                <div className='flex justify-between md:justify-start md:gap-10'>
                                  <span className='text-xs text-zinc-400 font-bold'>Số tiền</span>
                                  <span className='text-sm font-black text-blue-600'>{grandTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                              </div>
                              <div className='mt-6 p-4 bg-white rounded-2xl border-2 border-dashed border-zinc-200'>
                                <p className='text-[10px] font-black uppercase text-zinc-400 mb-1'>Nội dung chuyển khoản</p>
                                <p className='text-xs font-black text-black uppercase'>NIKE FOOTBALL {user?.name?.toUpperCase() || 'KHACH_HANG'}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className='mt-12'>
                      <label className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block'>Ghi chú cho đơn hàng</label>
                      <textarea
                        name='note'
                        rows={3}
                        value={form.note}
                        onChange={handleChange}
                        placeholder='Lưu ý về size, màu sắc hoặc chỉ dẫn giao hàng...'
                        className='w-full bg-zinc-50 border-2 border-zinc-100 rounded-[1.5rem] px-5 py-4 text-sm outline-none focus:border-black focus:bg-white transition-all'
                      />
                    </div>
                  </div>

                  <div className='flex gap-4'>
                    <button
                      onClick={() => setStep(1)}
                      className='flex-1 bg-zinc-200 text-black font-black py-6 rounded-[2rem] text-sm uppercase tracking-widest hover:bg-zinc-300 transition-all active:scale-95'
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleSubmit}
                      className='flex-[2] bg-black text-white font-black py-6 rounded-[2rem] text-sm uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl'
                    >
                      Xác nhận đặt hàng
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sidebar: Order Summary (4 Cols) ─────────────────── */}
          <div className='lg:col-span-4'>
            <div className='bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 sticky top-32'>
              <h2 className='text-lg font-black uppercase tracking-tighter mb-8'>Tóm tắt đơn hàng</h2>

              <div className='space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8'>
                {items.map((item, i) => (
                  <div key={i} className='flex gap-4 group'>
                    <div className='relative w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden shrink-0'>
                      <img src={item.images?.[0]} alt={item.name} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                      <div className='absolute top-1 right-1 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-full'>x{item.quantity}</div>
                    </div>
                    <div className='flex-1 py-1'>
                      <p className='text-xs font-black uppercase leading-tight line-clamp-2'>{item.name}</p>
                      <p className='text-[10px] text-zinc-400 font-bold uppercase mt-1'>Size EU {item.selectedSize}</p>
                      <p className='text-xs font-black mt-2'>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='space-y-4 pt-6 border-t border-zinc-100'>
                <div className='flex justify-between items-center text-xs'>
                  <span className='font-bold text-zinc-400 uppercase tracking-widest'>Tạm tính</span>
                  <span className='font-black'>{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className='flex justify-between items-center text-xs'>
                  <span className='font-bold text-zinc-400 uppercase tracking-widest'>Phí vận chuyển</span>
                  <span className={`font-black ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                    {shippingFee === 0 ? 'MIỄN PHÍ' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className='text-[9px] text-zinc-400 font-medium italic'>* Miễn phí vận chuyển cho đơn hàng từ 1.500.000đ</p>
                )}
                <div className='flex justify-between items-center pt-4 border-t border-zinc-200'>
                  <span className='text-sm font-black uppercase tracking-tighter'>Tổng thanh toán</span>
                  <span className='text-xl font-black tracking-tighter'>{grandTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {step === 2 && (
                <div className='mt-8 p-4 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200'>
                   <p className='text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2'>Địa chỉ giao hàng</p>
                   <p className='text-xs font-bold leading-relaxed truncate'>{form.fullName} | {form.phone}</p>
                   <p className='text-[10px] text-zinc-500 mt-1 line-clamp-1'>{form.street}, {getWardName()}, {getDistrictName()}, {getProvinceName()}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
