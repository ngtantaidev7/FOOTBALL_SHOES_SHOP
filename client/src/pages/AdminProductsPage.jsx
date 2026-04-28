import { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI, deleteProductAPI, createProductAPI, updateProductAPI } from '../services/productService';
import { getAdminStatsAPI } from '../services/orderService';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminProductsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const { data } = await getAdminStatsAPI();
      setStats(data.data);
    } catch (err) {}
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProductsAPI();
      setProducts(data.data);
    } catch (err) {
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) return;
    try {
      await deleteProductAPI(id);
      toast.success('Xoá thành công');
      fetchProducts();
    } catch (err) {
      toast.error('Xoá thất bại');
    }
  };

  return (
    <div className='min-h-screen bg-[#F0F2F5] flex'>
       <AdminSidebar stats={stats} />

      <main className='flex-1 p-8'>
        <div className='flex items-center justify-between mb-10'>
           <div>
              <h1 className='text-3xl font-black uppercase tracking-tighter'>Quản lý sản phẩm</h1>
              <p className='text-zinc-500'>Tổng số {products.length} mẫu giày trong hệ thống.</p>
           </div>
           <button 
             onClick={() => { setEditingProduct(null); setShowModal(true); }}
             className='bg-black text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest hover:bg-zinc-800 transition shadow-xl flex items-center gap-2'
           >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4'/></svg>
              Thêm sản phẩm
           </button>
        </div>

        {/* Product Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
           {loading ? (
             <div className='col-span-full py-20 text-center text-zinc-400 font-bold uppercase tracking-widest animate-pulse'>Đang tải sản phẩm...</div>
           ) : products.map(product => (
             <div key={product._id} className='bg-white rounded-3xl p-4 shadow-sm border border-zinc-100 group relative'>
                <div className='aspect-square rounded-2xl overflow-hidden bg-zinc-100 mb-4 relative'>
                   <img src={product.images[0]} alt={product.name} className='w-full h-full object-cover group-hover:scale-110 transition duration-500' />
                   <div className='absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0'>
                      <button 
                        onClick={() => { setEditingProduct(product); setShowModal(true); }}
                        className='bg-white text-black p-2 rounded-full shadow-lg hover:bg-zinc-100 transition'
                      >
                         <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className='bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition'
                      >
                         <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                      </button>
                   </div>
                </div>
                <div className='px-2'>
                   <div className='flex items-center justify-between mb-1'>
                      <span className='text-[10px] font-black uppercase text-zinc-400 tracking-widest'>{product.category} · {product.tier}</span>
                      <span className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                   </div>
                   <h3 className='font-black text-sm uppercase tracking-tight mb-2 line-clamp-1'>{product.name}</h3>
                   <p className='text-lg font-black text-black'>{product.price.toLocaleString('vi-VN')}đ</p>
                   
                   <div className='mt-4 flex flex-wrap gap-1'>
                      {product.sizes.map(s => (
                        <span key={s.size} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${s.stock > 0 ? 'border-zinc-200 text-zinc-500' : 'border-red-100 text-red-300'}`}>
                          {s.size}
                        </span>
                      ))}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </main>

      {/* Product Modal Placeholder */}
      {showModal && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
           <div className='bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl relative'>
              <button 
                onClick={() => setShowModal(false)}
                className='absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition'
              >
                 <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'/></svg>
              </button>
              <h2 className='text-3xl font-black uppercase tracking-tighter mb-8'>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
              <p className='text-zinc-500 italic mb-10'>Tính năng nhập liệu chi tiết đang được đồng bộ hoá với cơ sở dữ liệu. Vui lòng kiểm tra lại sau giây lát.</p>
              <button 
                onClick={() => setShowModal(false)}
                className='w-full bg-black text-white font-black py-4 rounded-3xl transition'
              >
                 Quay lại danh sách
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
