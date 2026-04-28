import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { getProductsAPI } from '../services/productService';
import heroImg from '../assets/hero_main.jpg';

const DEFAULT_FILTERS = {
  tier: [],
  surfaceType: [],
  category: [],
  minPrice: '',
  maxPrice: '',
  sort: '-createdAt',
  search: '',
};

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') || '',
    tier: searchParams.get('tier') ? [searchParams.get('tier')] : [],
    surfaceType: searchParams.get('surfaceType')
      ? [searchParams.get('surfaceType')]
      : [],
    category: searchParams.get('category')
      ? [searchParams.get('category')]
      : [],
  });

  // Sync filters whenever URL search params change (e.g., clicking Header menu while already on /shop)
  useEffect(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      search: searchParams.get('search') || '',
      tier: searchParams.get('tier') ? [searchParams.get('tier')] : [],
      surfaceType: searchParams.get('surfaceType')
        ? [searchParams.get('surfaceType')]
        : [],
      category: searchParams.get('category')
        ? [searchParams.get('category')]
        : [],
    });
    setPage(1);
  }, [searchParams]);

  // ── Dùng ref để tránh fetchProducts tạo reference mới mỗi render ──
  const filtersRef = useRef(filters);
  const pageRef = useRef(page);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // ── Chỉ trigger khi filters hoặc page thực sự thay đổi ────────────
  useEffect(() => {
    let cancelled = false; // cleanup flag tránh race condition

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await getProductsAPI({
          ...filtersRef.current,
          page: pageRef.current,
          limit: 12,
        });
        if (!cancelled) {
          setProducts(data.data);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    }; // cleanup khi unmount hoặc re-run
  }, [filters, page]); // ← depend trực tiếp vào giá trị, không dùng useCallback

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // reset về trang 1 khi đổi filter
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div className='min-h-screen bg-zinc-50'>
      {/* ── Page Header ────────────────────────────────────── */}
      <div className='relative bg-zinc-950 text-white py-24 md:py-32 px-6 overflow-hidden'>
        {/* Background Image */}
        <div className='absolute inset-0 z-0'>
          <img src={heroImg} alt='Shop Header' className='w-full h-full object-cover opacity-50' />
          <div className='absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-900/40 to-transparent'></div>
        </div>

        <div className='relative z-10 max-w-[1400px] mx-auto flex flex-col items-center text-center'>
          <h1 className='text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white drop-shadow-xl'>
            Trang bị bóng đá
          </h1>
          <p className='text-zinc-200 text-lg md:text-xl font-medium max-w-2xl drop-shadow-md'>
            Khám phá {pagination.total ?? '...'} sản phẩm đẳng cấp
            {filters.search && (
              <span>
                {' '}
                cho từ khóa "<strong>{filters.search}</strong>"
              </span>
            )}
          </p>
        </div>
      </div>

      <div className='max-w-[1400px] mx-auto px-6 pb-16 relative z-20 -mt-12 md:-mt-16'>
        {/* Search & Mobile Filter Toggle */}
        <div className='mb-8 flex gap-4 bg-white p-2 rounded-full shadow-lg border border-zinc-100'>
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            value={filters.search}
            onChange={(e) =>
              handleFilterChange({ ...filters, search: e.target.value })
            }
            className='flex-1 bg-transparent px-6 py-3 text-base outline-none'
          />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='lg:hidden flex items-center justify-center bg-black text-white rounded-full px-6 py-3 text-sm font-bold hover:bg-zinc-800 transition shadow-md'
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Bộ lọc
          </button>
          <div className='hidden lg:flex items-center justify-center bg-black text-white rounded-full px-8 py-3 text-sm font-bold shadow-md cursor-pointer'>
            Tìm kiếm
          </div>
        </div>

        <div className='flex gap-10'>
          {/* Sidebar desktop */}
          <aside className='hidden lg:block w-64 shrink-0'>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
            />
          </aside>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className='fixed inset-0 z-40 lg:hidden'>
              <div
                className='absolute inset-0 bg-black/50'
                onClick={() => setSidebarOpen(false)}
              />
              <div className='absolute left-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='font-black uppercase'>Bộ lọc</h3>
                  <button onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className='flex-1'>
            {loading ? (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className='bg-zinc-200 rounded-2xl aspect-[3/4] animate-pulse'
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-24 text-center'>
                <span className='text-6xl mb-4'>👟</span>
                <h3 className='text-xl font-black mb-2'>
                  Không tìm thấy sản phẩm
                </h3>
                <p className='text-zinc-400 text-sm mb-6'>
                  Thử thay đổi bộ lọc hoặc từ khoá
                </p>
                <button
                  onClick={handleReset}
                  className='bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-800 transition'
                >
                  Xoá bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className='flex justify-center gap-2 mt-10'>
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className='w-9 h-9 rounded-full border border-zinc-300 flex items-center justify-center text-sm hover:border-black disabled:opacity-30 transition'
                    >
                      ‹
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-full text-sm font-bold transition ${
                          page === i + 1
                            ? 'bg-black text-white'
                            : 'border border-zinc-300 hover:border-black'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, pagination.pages))
                      }
                      disabled={page === pagination.pages}
                      className='w-9 h-9 rounded-full border border-zinc-300 flex items-center justify-center text-sm hover:border-black disabled:opacity-30 transition'
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
