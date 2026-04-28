import { useState, useEffect } from 'react';
import heroBg from '../assets/about/hero-bg.png';
import squadImg from '../assets/about/squad-celebration.png';
import bootsAction from '../assets/about/boots-action.png';
import valuesBg from '../assets/about/values-bg.png';
import sinceBg from '../assets/about/since-bg.png';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      img: heroBg,
      label: 'Legacy of Speed',
      title: <>JUST DO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-zinc-200 italic">IT.</span></>,
      desc: 'Chúng tôi định nghĩa lại cách bạn cảm nhận mặt cỏ. Đỉnh cao công nghệ Nike, dành riêng cho những nhà vô địch.'
    },
    {
      img: bootsAction,
      label: 'Precision Power',
      title: <>VŨ KHÍ <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 italic">TỐI THƯỢNG.</span></>,
      desc: 'Mỗi đôi giày là một tác phẩm kỹ thuật, được thiết kế để tối ưu hóa từng cú sút và bước chạy của bạn.'
    },
    {
      img: squadImg,
      label: 'Football Culture',
      title: <>KẾT NỐI <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 italic">ĐAM MÊ.</span></>,
      desc: 'Hơn cả một cửa hàng, chúng tôi là nơi hội ngộ của những tâm hồn yêu bóng đá chân chính.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { number: '15+', label: 'Năm di sản' },
    { number: '100+', label: 'Mẫu mã độc quyền' },
    { number: '50K+', label: 'Vận động viên' },
    { number: '100%', label: 'Chính hãng' },
  ];

  const coreValues = [
    {
      label: 'Công nghệ',
      name: 'Đổi mới không ngừng',
      desc: 'Chúng tôi luôn đi đầu trong việc cập nhật những công nghệ giày bóng đá mới nhất từ Nike.',
      img: valuesBg
    },
    {
      label: 'Cam kết',
      name: 'Hiệu suất đỉnh cao',
      desc: 'Mỗi đôi giày đều được kiểm định kỹ lưỡng để đảm bảo mang lại hiệu suất tối đa trên sân cỏ.',
      img: bootsAction
    },
    {
      label: 'Kết nối',
      name: 'Cộng đồng đam mê',
      desc: 'Chúng tôi không chỉ bán giày, chúng tôi xây dựng cộng đồng cho những người yêu môn thể thao vua.',
      img: squadImg
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* ── Dynamic Hero Section with Slider ─────────────────────────── */}
      <section className="relative h-[85vh] flex items-center justify-center bg-black overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={heroSlides[currentSlide].img} 
                alt="Nike Football" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-white"></div>
        </div>
        
        {/* Content Slider */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-6">
                {heroSlides[currentSlide].label}
              </p>
              <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-black text-white leading-none uppercase tracking-tighter mb-8">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                {heroSlides[currentSlide].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? 'w-12 bg-blue-600' : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Stats Section with Premium Layout ─────────────── */}
      <section className="relative z-20 -mt-24 px-6 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
           {stats.map((s, i) => (
             <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-zinc-200 border border-zinc-100 flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-all duration-500">
                   <h3 className="text-4xl md:text-6xl font-black text-black mb-2 tracking-tighter">{s.number}</h3>
                   <p className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">{s.label}</p>
                </div>
             </ScrollReveal>
           ))}
        </div>
      </section>

      {/* ── Vision Section: The Story ─────────────────────── */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
               <ScrollReveal direction="left">
                  <div className="relative">
                     <img 
                       src={squadImg} 
                       alt="Players" 
                       className="rounded-[60px] w-full h-[600px] object-cover shadow-2xl"
                     />
                     <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-[50px] overflow-hidden hidden md:flex flex-col justify-end shadow-2xl group">
                        <img 
                          src={sinceBg} 
                          alt="Since 2010" 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-blue-600/60 mix-blend-multiply"></div>
                        <div className="relative z-10 p-10 text-white">
                           <p className="text-4xl font-black mb-2 italic">Since</p>
                           <p className="text-xl font-bold opacity-80 uppercase tracking-widest">2010</p>
                        </div>
                     </div>
                  </div>
               </ScrollReveal>
            </div>
            <div className="order-1 lg:order-2 space-y-10">
               <ScrollReveal direction="right">
                  <div>
                     <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Câu chuyện của chúng tôi</p>
                     <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                       Hơn cả một <br /> <span className="text-zinc-300">đôi giày.</span>
                     </h2>
                  </div>
               </ScrollReveal>
               <ScrollReveal direction="right" delay={0.2}>
                  <div className="space-y-6 text-zinc-500 text-lg leading-relaxed font-medium">
                     <p>
                       Hành trình của chúng tôi bắt đầu từ niềm đam mê mãnh liệt với quả bóng tròn và sự thán phục trước những bước chạy của các huyền thoại. Chúng tôi hiểu rằng, trên sân cỏ, đôi giày chính là vũ khí, là người đồng hành trung thành nhất của mỗi cầu thủ.
                     </p>
                     <p>
                       Nike Football Store không chỉ phân phối sản phẩm, chúng tôi mang đến giấc mơ và sự tự tin. Với 15 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng nghìn vận động viên chuyên nghiệp và nghiệp dư tại Việt Nam.
                     </p>
                  </div>
               </ScrollReveal>
               <div className="pt-8 grid grid-cols-2 gap-8">
                  <ScrollReveal direction="right" delay={0.3}>
                     <div className="space-y-2">
                        <p className="text-black font-black text-xl uppercase tracking-tighter">Sứ mệnh</p>
                        <p className="text-zinc-400 text-sm">Truyền cảm hứng và mang lại sự đột phá cho mọi cầu thủ trên thế giới.</p>
                     </div>
                  </ScrollReveal>
                  <ScrollReveal direction="right" delay={0.4}>
                     <div className="space-y-2">
                        <p className="text-black font-black text-xl uppercase tracking-tighter">Tầm nhìn</p>
                        <p className="text-zinc-400 text-sm">Trở thành biểu tượng của văn hóa bóng đá hiện đại tại khu vực.</p>
                     </div>
                  </ScrollReveal>
               </div>
            </div>
         </div>
      </section>

      {/* ── Core Values Section: Image Background Cards ─────────── */}
      <section className="bg-white py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <ScrollReveal>
               <div className="text-center mb-16 space-y-2">
                  <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight">Giá trị cốt lõi</h2>
                  <p className="text-zinc-400 font-medium text-sm">Triết lý và cam kết của chúng tôi đối với cộng đồng bóng đá.</p>
               </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {coreValues.map((v, i) => (
                 <ScrollReveal key={i} delay={i * 0.2}>
                    <div className="group relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer">
                       {/* Bg Image */}
                       <img 
                         src={v.img} 
                         alt={v.name} 
                         className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       {/* Overlay */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                       
                       {/* Content */}
                       <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{v.label}</p>
                          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{v.name}</h3>
                          <p className="text-sm font-medium text-zinc-300 leading-relaxed max-w-[240px]">
                             {v.desc}
                          </p>
                       </div>
                    </div>
                 </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── Call to Action: Join the Squad ─────────────────── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
         <img 
           src={bootsAction} 
           alt="Football Boots" 
           className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-blue-600/90 mix-blend-multiply"></div>
         <div className="relative z-10 text-center text-white px-6">
            <ScrollReveal>
               <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10">Sẵn sàng để <br /> tỏa sáng?</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
               <button 
                 onClick={() => window.location.href = '/shop'}
                 className="bg-white text-black font-black px-12 py-5 rounded-full text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all transform hover:scale-110 shadow-2xl"
               >
                  Khám phá bộ sưu tập ngay
               </button>
            </ScrollReveal>
         </div>
      </section>

      {/* ── Footer-like Contact ──────────────────────────── */}
      <section className="bg-black py-20 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <ScrollReveal direction="left">
               <div className="text-center md:text-left">
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-2">Kết nối với đội ngũ</h3>
                  <p className="text-zinc-500 font-medium">Chúng tôi luôn ở đây để hỗ trợ những bước chạy của bạn.</p>
               </div>
            </ScrollReveal>
            <div className="flex flex-wrap justify-center gap-6">
               <ScrollReveal direction="right" delay={0.1}>
                  <a href="mailto:support@nikefootball.vn" className="flex items-center gap-4 bg-zinc-900 px-8 py-4 rounded-3xl hover:bg-zinc-800 transition border border-zinc-800">
                     <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                     </div>
                     <span className="text-white font-bold text-sm">support@nikefootball.vn</span>
                  </a>
               </ScrollReveal>
               <ScrollReveal direction="right" delay={0.2}>
                  <a href="tel:19001234" className="flex items-center gap-4 bg-zinc-900 px-8 py-4 rounded-3xl hover:bg-zinc-800 transition border border-zinc-800">
                     <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                     </div>
                     <span className="text-white font-bold text-sm">1900 1234</span>
                  </a>
               </ScrollReveal>
            </div>
         </div>
      </section>
    </div>
  );
}
