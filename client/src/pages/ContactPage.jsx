import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Hotline',
      value: '1900 1234',
      desc: 'Hỗ trợ 24/7 cho mọi thắc mắc của bạn.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'support@nikefootball.vn',
      desc: 'Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Địa chỉ',
      value: 'Quận 1, TP. Hồ Chí Minh',
      desc: 'Ghé thăm showroom của chúng tôi để trải nghiệm.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
              LIÊN <span className="text-zinc-200">HỆ.</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
              Đội ngũ Nike Football Store luôn sẵn sàng lắng nghe và hỗ trợ bạn chinh phục mọi thử thách trên sân cỏ.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {contactInfo.map((info, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 hover:shadow-2xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {info.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-2">{info.label}</h3>
                <p className="text-2xl font-black mb-4">{info.value}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{info.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-8">
              <h2 className="text-4xl font-black uppercase tracking-tight">Gửi tin nhắn cho chúng tôi</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Họ và tên</label>
                    <input type="text" className="w-full bg-zinc-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-black transition" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Email</label>
                    <input type="email" className="w-full bg-zinc-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-black transition" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Chủ đề</label>
                  <input type="text" className="w-full bg-zinc-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-black transition" placeholder="Tôi cần hỗ trợ về..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Nội dung</label>
                  <textarea rows="5" className="w-full bg-zinc-50 border-none rounded-[32px] px-6 py-4 focus:ring-2 focus:ring-black transition" placeholder="Nhập nội dung tin nhắn của bạn"></textarea>
                </div>
                <button className="bg-black text-white font-black uppercase tracking-[0.2em] px-12 py-5 rounded-full hover:bg-zinc-800 transition transform hover:scale-105 shadow-xl">
                  Gửi yêu cầu ngay
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative rounded-[60px] overflow-hidden h-[600px] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop" 
                alt="Football Field" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 p-16 flex flex-col justify-end">
                <p className="text-white text-5xl font-black uppercase italic leading-none mb-6">
                  WE ARE <br /> THE GAME.
                </p>
                <div className="h-1 w-20 bg-blue-600"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
