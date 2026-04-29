import { useEffect, useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import stadiumBg from '../assets/stadium-bg.png';

const API_PROVINCES = 'https://provinces.open-api.vn/api';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Address Form State
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    isDefault: false
  });

  // API Data States
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

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

  // ── Fetch Tỉnh/Thành ──────────────────────────────────────────
  useEffect(() => {
    if (isModalOpen) {
      fetch(`${API_PROVINCES}/p/`)
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(() => toast.error('Lỗi tải danh sách tỉnh thành'));
    }
  }, [isModalOpen]);

  // ── Fetch Quận/Huyện ──────────────────────────────────────────
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict('');
      setSelectedWard('');
      return;
    }
    fetch(`${API_PROVINCES}/p/${selectedProvince}?depth=2`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data.districts || []);
        setSelectedDistrict('');
        setWards([]);
        setSelectedWard('');
      });
  }, [selectedProvince]);

  // ── Fetch Phường/Xã ───────────────────────────────────────────
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard('');
      return;
    }
    fetch(`${API_PROVINCES}/d/${selectedDistrict}?depth=2`)
      .then(res => res.json())
      .then(data => {
        setWards(data.wards || []);
        setSelectedWard('');
      });
  }, [selectedDistrict]);

  const getProvinceName = () => provinces.find(p => p.code == selectedProvince)?.name || '';
  const getDistrictName = () => districts.find(d => d.code == selectedDistrict)?.name || '';
  const getWardName = () => wards.find(w => w.code == selectedWard)?.name || '';

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      toast.error('Vui lòng chọn đầy đủ địa chỉ');
      return;
    }

    try {
      const addressData = {
        ...newAddress,
        city: getProvinceName(),
        district: getDistrictName(),
        ward: getWardName()
      };

      const updatedAddresses = [...(user.addresses || [])];
      
      if (addressData.isDefault) {
        updatedAddresses.forEach(a => a.isDefault = false);
      }
      
      updatedAddresses.push(addressData);
      
      const res = await updateProfile({ addresses: updatedAddresses });
      if (res.success) {
        toast.success('Thêm địa chỉ thành công');
        setIsModalOpen(false);
        resetForm();
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const resetForm = () => {
    setNewAddress({ fullName: '', phone: '', street: '', isDefault: false });
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const setAsDefault = async (index) => {
    try {
      const updatedAddresses = user.addresses.map((a, i) => ({
        ...a,
        isDefault: i === index
      }));
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Đã cập nhật địa chỉ mặc định');
    } catch (err) {
      toast.error('Cập nhật thất bại');
    }
  };

  const deleteAddress = async (index) => {
    try {
      const updatedAddresses = user.addresses.filter((_, i) => i !== index);
      await updateProfile({ addresses: updatedAddresses });
      toast.success('Xóa địa chỉ thành công');
    } catch (err) {
      toast.error('Xóa thất bại');
    }
  };

  if (!user) return null;

  return (
    <div className='min-h-screen bg-[#F0F2F5] pb-24'>
      {/* Header Banner */}
      <div className='relative h-[450px] overflow-hidden flex items-center justify-center bg-black'>
        <div 
          className='absolute inset-0 bg-cover bg-center opacity-80' 
          style={{ backgroundImage: `url(${stadiumBg})` }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#F0F2F5]' />
        
        <div className='relative z-10 text-center space-y-4'>
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className='text-6xl md:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-2xl'
           >
              Account
           </motion.h1>
           <p className='text-white/60 font-bold uppercase tracking-[0.4em] text-xs'>Trải nghiệm đặc quyền Nike Member</p>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 -mt-32 relative z-20'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          
          {/* Sidebar */}
          <div className='lg:col-span-4 space-y-6'>
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className='bg-white p-8 rounded-[40px] shadow-2xl border border-white'
             >
                <div className='flex flex-col items-center text-center'>
                   <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 shadow-xl'>
                      {user.avatar ? (
                         <img src={user.avatar} className='w-full h-full object-cover' />
                      ) : (
                         <div className='w-full h-full bg-zinc-900 flex items-center justify-center text-4xl font-black text-white'>
                            {user.name.charAt(0).toUpperCase()}
                         </div>
                      )}
                   </div>
                   <h2 className='text-3xl font-black uppercase tracking-tighter mt-6'>{user.name}</h2>
                   <p className='text-zinc-400 font-bold text-sm'>{user.email}</p>
                </div>

                <div className='grid grid-cols-3 gap-2 mt-10 pt-8 border-t border-zinc-50'>
                   <div className='text-center'>
                      <p className='text-xl font-black'>{stats.total}</p>
                      <p className='text-[8px] font-black uppercase text-zinc-400'>Orders</p>
                   </div>
                   <div className='text-center border-x border-zinc-100'>
                      <p className='text-xl font-black text-[#E5000A]'>{stats.pending}</p>
                      <p className='text-[8px] font-black uppercase text-zinc-400'>Pending</p>
                   </div>
                   <div className='text-center'>
                      <p className='text-xl font-black text-green-600'>{stats.completed}</p>
                      <p className='text-[8px] font-black uppercase text-zinc-400'>Done</p>
                   </div>
                </div>
             </motion.div>

             <button onClick={() => navigate('/orders')} className='w-full bg-white text-black font-black py-4 rounded-3xl text-[10px] uppercase tracking-widest shadow-sm border border-white hover:bg-black hover:text-white transition-all'>Lịch sử mua hàng</button>
             <button onClick={logout} className='w-full bg-white text-[#E5000A] font-black py-4 rounded-3xl text-[10px] uppercase tracking-widest shadow-sm border border-white hover:bg-[#E5000A] hover:text-white transition-all'>Đăng xuất</button>
          </div>

          {/* Main Area */}
          <div className='lg:col-span-8 space-y-10'>
             <div className='bg-white p-10 rounded-[40px] shadow-sm border border-white'>
                <div className='flex items-center justify-between mb-10'>
                   <h3 className='text-2xl font-black uppercase tracking-tighter'>Sổ địa chỉ</h3>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className='bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2'
                   >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4'/></svg>
                      Thêm mới
                   </button>
                </div>

                {user.addresses && user.addresses.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {user.addresses.map((addr, idx) => (
                      <div 
                        key={idx}
                        className={`p-8 rounded-[2.5rem] border-2 transition-all group relative ${
                           addr.isDefault ? 'border-black bg-zinc-50/50 shadow-xl' : 'border-zinc-50 bg-white hover:border-zinc-200'
                        }`}
                      >
                         {addr.isDefault && (
                            <div className='absolute -top-3 left-8 bg-black text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest z-10'>Mặc định</div>
                         )}
                         <div className='flex justify-between items-start mb-4'>
                            <p className='font-black text-lg uppercase tracking-tighter'>{addr.fullName}</p>
                            <button onClick={() => deleteAddress(idx)} className='p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'>
                               <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                            </button>
                         </div>
                         <p className='text-xs font-bold text-zinc-400 mb-6'>{addr.phone}</p>
                         <p className='text-xs text-zinc-600 font-medium leading-relaxed'>{addr.street}, {addr.ward}</p>
                         <p className='text-xs text-zinc-600 font-medium leading-relaxed'>{addr.district}, {addr.city}</p>
                         
                         {!addr.isDefault && (
                            <button onClick={() => setAsDefault(idx)} className='mt-8 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline'>Thiết lập mặc định</button>
                         )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='py-20 text-center border-2 border-dashed border-zinc-100 rounded-[3rem]'>
                     <p className='text-zinc-400 font-bold text-xs uppercase tracking-widest'>Bạn chưa có địa chỉ nào</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
         {isModalOpen && (
            <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className='absolute inset-0 bg-black/60 backdrop-blur-md' />
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className='bg-white w-full max-w-lg rounded-[40px] p-10 relative z-10 shadow-2xl'
               >
                  <div className='flex items-center justify-between mb-8'>
                     <h2 className='text-3xl font-black uppercase tracking-tighter'>Thêm địa chỉ</h2>
                     <button onClick={() => setIsModalOpen(false)} className='w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
                     </button>
                  </div>

                  <form onSubmit={handleAddAddress} className='space-y-4'>
                     <div className='grid grid-cols-2 gap-4'>
                        <input required placeholder='Họ tên nhận hàng' value={newAddress.fullName} onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} className='w-full bg-zinc-50 border-none rounded-3xl px-6 py-3.5 text-sm font-bold' />
                        <input required placeholder='Số điện thoại' value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} className='w-full bg-zinc-50 border-none rounded-3xl px-6 py-3.5 text-sm font-bold' />
                     </div>

                     <input required placeholder='Địa chỉ chi tiết (Số nhà, đường)' value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} className='w-full bg-zinc-50 border-none rounded-3xl px-6 py-3.5 text-sm font-bold' />

                     <div className='grid grid-cols-1 gap-3'>
                        <div className='relative'>
                           <select required value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className='w-full bg-zinc-50 border-none rounded-2xl px-6 py-3.5 text-xs font-bold appearance-none cursor-pointer'>
                              <option value=''>Chọn Tỉnh/Thành phố</option>
                              {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                           </select>
                           <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]'>▼</div>
                        </div>

                        <div className='grid grid-cols-2 gap-3'>
                           <div className='relative'>
                              <select required value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince} className='w-full bg-zinc-50 border-none rounded-2xl px-6 py-3.5 text-xs font-bold appearance-none cursor-pointer disabled:opacity-50'>
                                 <option value=''>Quận/Huyện</option>
                                 {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                              </select>
                              <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]'>▼</div>
                           </div>
                           <div className='relative'>
                              <select required value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict} className='w-full bg-zinc-50 border-none rounded-2xl px-6 py-3.5 text-xs font-bold appearance-none cursor-pointer disabled:opacity-50'>
                                 <option value=''>Phường/Xã</option>
                                 {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                              </select>
                              <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[8px]'>▼</div>
                           </div>
                        </div>
                     </div>

                     <div className='flex items-center gap-3 px-2 py-4'>
                        <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})} className='w-5 h-5 rounded-lg accent-black' />
                        <label htmlFor="isDefault" className='text-xs font-black uppercase tracking-widest cursor-pointer'>Đặt làm mặc định</label>
                     </div>

                     <button type="submit" className='w-full bg-black text-white font-black py-4 rounded-full text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4'>Lưu địa chỉ</button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
