import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Giày ở cửa hàng có phải hàng chính hãng không?',
      a: 'Tất cả sản phẩm tại Nike Football Store đều cam kết 100% chính hãng, nhập khẩu trực tiếp từ các đối tác uy tín của Nike. Chúng tôi sẵn sàng đền bù gấp 10 lần nếu phát hiện hàng giả.'
    },
    {
      q: 'Tôi có thể thử giày tại nhà không?',
      a: 'Hiện tại chúng tôi hỗ trợ dịch vụ "Thử giày tại chỗ" khi giao hàng trong khu vực nội thành TP.HCM. Bạn có thể kiểm tra và thử size trước khi thanh toán.'
    },
    {
      q: 'Làm sao để biết giày phù hợp với loại sân nào?',
      a: 'Chúng tôi có phân loại rõ ràng: FG (Sân cỏ tự nhiên), AG (Sân nhân tạo cỏ cao), TF (Sân nhân tạo cỏ thấp/sân bê tông). Bạn có thể xem trong phần mô tả sản phẩm hoặc liên hệ nhân viên để được tư vấn.'
    },
    {
      q: 'Thời gian giao hàng là bao lâu?',
      a: 'Nội thành TP.HCM sẽ nhận được trong 2-4 giờ hoặc trong ngày. Các tỉnh thành khác từ 2-4 ngày làm việc tùy vào đơn vị vận chuyển.'
    },
    {
      q: 'Cửa hàng có hỗ trợ trả góp không?',
      a: 'Chúng tôi hỗ trợ trả góp 0% qua thẻ tín dụng và các ứng dụng thanh toán phổ biến như Fundiin, Kredivo.'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
              HỎI & <span className="text-zinc-200">ĐÁP.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium">
              Giải đáp những thắc mắc thường gặp của các cầu thủ khi mua sắm tại hệ thống của chúng tôi.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div 
                className={`border border-zinc-100 rounded-[32px] overflow-hidden transition-all duration-500 ${activeIndex === i ? 'bg-zinc-50 shadow-xl scale-[1.02]' : 'bg-white'}`}
              >
                <button 
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  className="w-full px-10 py-8 flex items-center justify-between text-left"
                >
                  <span className="text-lg font-black uppercase tracking-tight">{faq.q}</span>
                  <span className={`transform transition-transform duration-500 ${activeIndex === i ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </button>
                <AnimatePresence>
                  {activeIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-10 pb-10 text-zinc-600 leading-relaxed font-medium border-t border-zinc-100 pt-6">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.6}>
          <div className="mt-20 text-center">
            <p className="text-zinc-400 font-bold mb-6">Vẫn còn thắc mắc khác?</p>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="bg-black text-white font-black uppercase tracking-widest px-10 py-4 rounded-full hover:bg-zinc-800 transition shadow-lg"
            >
              Liên hệ với chúng tôi
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
