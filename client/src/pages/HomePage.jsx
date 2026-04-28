import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getFeaturedProductsAPI } from '../services/productService';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

// ── Local assets (đã tải về src/assets) ─────────────────────────
import heroImg  from '../assets/hero_main.jpg';
import catFg    from '../assets/cat_fg.jpg';
import catAg    from '../assets/cat_ag.jpg';
import catTf    from '../assets/cat_tf.jpg';
import ctaBg    from '../assets/cta_bg.jpg';
import giayMoi1 from '../assets/giay-da-banh-nike-chinh-hang.jpg';
import giayMoi2 from '../assets/anhmoi2.jpg';
import tierElite from '../assets/tier_elite.jpg';
import tierPro from '../assets/tier_pro.jpg';
import tierAcademy from '../assets/tier_aca.jpg';


export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [currentHeroImg, setCurrentHeroImg] = useState(0);

  const heroSlides = [
    {
      img: heroImg,
      badge: 'Nike Football 2025',
      title: <>JUST <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400'>PLAY.</span></>,
      desc: 'Trang bị đôi giày tốt nhất để chinh phục mọi sân đấu. Đỉnh cao công nghệ, dẫn đầu tốc độ.'
    },
    {
      img: giayMoi1,
      badge: 'New Arrival',
      title: <>MERCURIAL <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500'>ELITE.</span></>,
      desc: 'Siêu phẩm tốc độ mới nhất đã cập bến. Nhẹ hơn, nhanh hơn và mạnh mẽ hơn bao giờ hết.'
    },
    {
      img: giayMoi2,
      badge: 'Phantom Series',
      title: <>CHÀO MỪNG <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600'>HUYỀN THOẠI.</span></>,
      desc: 'Dòng giày dành cho những bậc thầy kiểm soát. Độ chính xác tuyệt đối trong từng pha chạm bóng.'
    }
  ];

  useEffect(() => {
    getFeaturedProductsAPI()
      .then((res) => {
        // axios: res.data = { success: true, data: [...] }
        const list = res.data?.data;
        setFeatured(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error('Featured API error:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImg((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleNext = () => {
    setCurrentHeroImg((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setCurrentHeroImg((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className='relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-black'>
        {/* Animated Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentHeroImg ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }}
          />
        ))}

        {/* Overlay – darker on left for text, transparent on right for photo */}
        <div
          className='absolute inset-0 z-0'
          style={{
            background:
              'linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.10) 100%)',
          }}
        />

        {/* Slider Controls */}
        <div className='absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex items-center gap-4'>
          <button
            onClick={handlePrev}
            className='w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black hover:scale-110 transition-all shadow-2xl'
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={handleNext}
            className='w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black hover:scale-110 transition-all shadow-2xl'
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 w-full'>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImg}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Live badge */}
              <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6'>
                <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                <p className='text-white/90 text-xs font-bold tracking-[0.25em] uppercase'>
                  {heroSlides[currentHeroImg].badge}
                </p>
              </div>

              <h1 className='text-6xl md:text-[10rem] font-black text-white leading-[0.8] uppercase mb-10 drop-shadow-2xl tracking-tighter'>
                {heroSlides[currentHeroImg].title}
              </h1>

              <p className='text-zinc-200 text-lg md:text-xl max-w-md mb-12 leading-relaxed drop-shadow-md font-medium'>
                {heroSlides[currentHeroImg].desc}
              </p>

              <div className='flex flex-wrap gap-4'>
                <button
                  onClick={() => navigate('/shop')}
                  className='bg-white text-black font-black px-10 py-5 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-100 hover:scale-105 transition-all duration-200 shadow-xl'
                >
                  Mua ngay
                </button>
                <button
                  onClick={() => navigate('/shop?featured=true')}
                  className='bg-white/10 backdrop-blur-sm border-2 border-white text-white font-black px-10 py-5 rounded-full text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200'
                >
                  Xem bộ sưu tập
                </button>
              </div>

              {/* Stats strip */}
              <div className='flex gap-12 mt-20'>
                {[
                  { value: '50+', label: 'Mẫu giày' },
                  { value: '3',   label: 'Loại sân' },
                  { value: '100%', label: 'Chính hãng' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className='text-white text-3xl font-black'>{s.value}</p>
                    <p className='text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-1'>{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── DYNAMIC CATEGORIES (ACCORDION STYLE) ──────────────── */}
      <section className='py-32 bg-black overflow-hidden'>
        <div className='max-w-[1600px] mx-auto px-6 mb-16'>
          <ScrollReveal>
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-8'>
              <div className='max-w-2xl'>
                <h2 className='text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6'>
                  Vũ Khí <br /> <span className='text-zinc-500'>Theo Mặt Sân.</span>
                </h2>
                <p className='text-zinc-400 text-lg font-medium'>
                  Mỗi mặt sân yêu cầu một bộ kỹ năng và trang bị khác nhau. Hãy chọn công cụ phù hợp để thống trị trận đấu.
                </p>
              </div>
              <div className='hidden md:block'>
                <div className='w-24 h-24 rounded-full border border-white/20 flex items-center justify-center animate-spin-slow'>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v1m0 11v1m8-5h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className='flex flex-col md:flex-row h-[700px] w-full gap-2 px-2'>
          {[
            { 
              label: 'Sân cỏ tự nhiên', 
              code: 'FG', 
              img: catFg, 
              desc: 'Tối ưu độ bám cho các mặt sân cỏ mềm và khô.' ,
              features: ['Đinh cao', 'Trọng lượng nhẹ', 'Độ bám tối đa']
            },
            { 
              label: 'Sân nhân tạo', 
              code: 'AG', 
              img: catAg, 
              desc: 'Thiết kế đa năng cho các loại cỏ nhân tạo hiện đại.',
              features: ['Đinh tròn', 'Giảm chấn tốt', 'Bền bỉ']
            },
            { 
              label: 'Sân cứng / Futsal', 
              code: 'TF', 
              img: catTf, 
              desc: 'Duy trì tốc độ và sự ổn định trên mặt sân bê tông hoặc cỏ lùn.',
              features: ['Đinh dăm', 'Đệm cao su', 'Kiểm soát bóng']
            },
          ].map((cat, i) => (
            <Link
              key={cat.code}
              to={`/shop?surfaceType=${cat.code}`}
              className='relative group flex-1 hover:flex-[2.5] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden rounded-[2.5rem]'
            >
              {/* Image Background */}
              <img
                src={cat.img}
                alt={cat.label}
                className='absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0'
              />
              
              {/* Overlays */}
              <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 opacity-80 group-hover:opacity-100' />
              <div className='absolute inset-0 border-r border-white/5 last:border-0' />

              {/* Vertical Title (Visible when collapsed) */}
              <div className='absolute top-10 left-1/2 -translate-x-1/2 md:top-1/2 md:left-10 md:-translate-y-1/2 md:translate-x-0 transition-all duration-500 group-hover:opacity-0 group-hover:pointer-events-none'>
                <p className='text-white text-6xl md:text-8xl font-black opacity-20 uppercase rotate-0 md:-rotate-90 origin-center whitespace-nowrap tracking-tighter'>
                  {cat.code}
                </p>
              </div>

              {/* Expanded Content */}
              <div className='absolute inset-0 p-8 md:p-16 flex flex-col justify-end opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-100'>
                <div className='max-w-md'>
                  <span className='inline-block px-4 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6'>
                    {cat.code} SERIES
                  </span>
                  <h3 className='text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4'>
                    {cat.label}
                  </h3>
                  <p className='text-zinc-300 text-lg font-medium mb-8'>
                    {cat.desc}
                  </p>
                  
                  <div className='flex flex-wrap gap-3 mb-10'>
                    {cat.features.map(f => (
                      <span key={f} className='px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold'>
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className='flex items-center gap-4 group/btn'>
                    <span className='text-white font-black uppercase tracking-widest text-sm'>Khám phá ngay</span>
                    <div className='w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover/btn:scale-110 group-hover/btn:translate-x-2'>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corner Code */}
              <div className='absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                <span className='text-white/20 text-8xl font-black italic'>{cat.code}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ───────────────────────────────────────── */}
      <section className='py-24 bg-white'>
        <div className='max-w-[1400px] mx-auto px-6'>
          <ScrollReveal>
            <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4'>
              <div>
                <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tight text-black'>
                  Sản Phẩm Nổi Bật
                </h2>
                <p className='text-zinc-500 mt-3 md:mt-4 text-base md:text-lg'>
                  Những siêu phẩm được săn đón nhiều nhất mùa này.
                </p>
              </div>
              <Link to='/shop' className='text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all'>
                Xem tất cả
              </Link>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
              {[...Array(8)].map((_, i) => (
                <div key={i} className='bg-zinc-100 rounded-[2rem] aspect-square animate-pulse' />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
              {featured.map((p, i) => (
                <ScrollReveal key={p._id} delay={(i % 4) * 0.1} direction="up">
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className='text-center text-zinc-400 py-12'>
              Chưa có sản phẩm nổi bật. Hãy chạy seed để thêm dữ liệu.
            </p>
          )}
        </div>
      </section>

      {/* ── TIERS ──────────────────────────────────────────── */}
      <section className='py-32 bg-zinc-50'>
        <div className='max-w-[1400px] mx-auto px-6'>
          <ScrollReveal>
            <div className='flex flex-col items-center mb-16 text-center'>
              <h2 className='text-4xl md:text-5xl font-black uppercase tracking-tight text-black'>
                Phân Khúc
              </h2>
              <p className='text-zinc-500 mt-4 text-lg max-w-xl'>
                Lựa chọn vũ khí phù hợp với phong cách và cấp độ chơi của bạn.
              </p>
            </div>
          </ScrollReveal>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
            {[
              {
                tier: 'Elite',
                subtitle: 'Đẳng Cấp',
                desc: 'Thiết kế tối tân dành cho cầu thủ chuyên nghiệp. Trọng lượng siêu nhẹ, công nghệ đột phá.',
                bgImg: tierElite,
              },
              {
                tier: 'Pro',
                subtitle: 'Hiệu Suất',
                desc: 'Cân bằng hoàn hảo giữa hiệu năng và giá trị. Phù hợp cho những trận đấu căng thẳng.',
                bgImg: tierPro,
              },
              {
                tier: 'Academy',
                subtitle: 'Bắt Đầu',
                desc: 'Sự lựa chọn lý tưởng cho người mới làm quen, bền bỉ và dễ tiếp cận.',
                bgImg: tierAcademy,
              },
            ].map((t, i) => (
              <ScrollReveal key={t.tier} delay={i * 0.2} direction="up">
                <Link
                  to={`/shop?tier=${t.tier}`}
                  className="relative overflow-hidden rounded-[3rem] h-[600px] flex flex-col group hover:-translate-y-4 transition-all duration-700 shadow-2xl text-white"
                >
                  {/* Background Image Container */}
                  <div className='absolute inset-0 z-0'>
                    <img 
                      src={t.bgImg} 
                      alt={t.tier} 
                      className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90'></div>
                    <div className='absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500'></div>
                  </div>

                  {/* Content Top */}
                  <div className='relative z-10 p-10 md:p-12'>
                    <span className='text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 block mb-3'>
                      {t.subtitle}
                    </span>
                    <h3 className='text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 group-hover:italic transition-all duration-500'>
                      {t.tier}
                    </h3>
                    <div className="w-12 h-1.5 bg-blue-600 mb-6 group-hover:w-24 transition-all duration-500"></div>
                  </div>

                  {/* Description - aligned at bottom */}
                  <div className='relative z-10 p-10 md:p-12 mt-auto bg-gradient-to-t from-black/80 to-transparent'>
                    <p className='text-zinc-300 text-sm md:text-base leading-relaxed font-medium mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700'>
                      {t.desc}
                    </p>
                    <div className='flex items-center justify-between border-t border-white/10 pt-6'>
                      <span className='text-[10px] font-black uppercase tracking-widest'>Explore {t.tier} Series</span>
                      <div className='w-12 h-12 rounded-full flex items-center justify-center bg-white text-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl'>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className='relative py-24 bg-black overflow-hidden'>
        <img
          src={ctaBg}
          alt='cta background'
          className='absolute inset-0 w-full h-full object-cover opacity-40'
        />
        <div className='relative z-10 text-center text-white px-6'>
          <ScrollReveal direction="up">
            <h2 className='text-4xl md:text-6xl font-black uppercase mb-4'>Sẵn sàng thi đấu?</h2>
            <p className='text-zinc-400 mb-8 max-w-md mx-auto'>
              Hơn 50 mẫu giày Nike Football đang chờ bạn.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className='bg-white text-black font-black px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-200 hover:scale-105 transition-all duration-200'
            >
              Khám phá ngay
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
