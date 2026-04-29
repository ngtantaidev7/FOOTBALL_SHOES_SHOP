import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function SizeGuidePage() {
  const sizeChart = [
    { cm: '24.0', us: '6', uk: '5.5', eur: '38.5' },
    { cm: '24.5', us: '6.5', uk: '6', eur: '39' },
    { cm: '25.0', us: '7', uk: '6', eur: '40' },
    { cm: '25.5', us: '7.5', uk: '6.5', eur: '40.5' },
    { cm: '26.0', us: '8', uk: '7', eur: '41' },
    { cm: '26.5', us: '8.5', uk: '7.5', eur: '42' },
    { cm: '27.0', us: '9', uk: '8', eur: '42.5' },
    { cm: '27.5', us: '9.5', uk: '8.5', eur: '43' },
    { cm: '28.0', us: '10', uk: '9', eur: '44' },
    { cm: '28.5', us: '10.5', uk: '9.5', eur: '44.5' },
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
              CHỌN <span className="text-zinc-200">SIZE</span> GIÀY.
            </h1>
            <p className="text-zinc-500 text-lg max-w-3xl mx-auto font-medium">
              Đôi giày hoàn hảo bắt đầu từ kích cỡ chuẩn xác. Hãy làm theo hướng dẫn dưới đây để tìm ra size giày Nike phù hợp nhất với bạn.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <ScrollReveal direction="left">
            <div className="space-y-12">
              <h2 className="text-3xl font-black uppercase tracking-tight">Cách đo chiều dài chân</h2>
              <div className="space-y-6">
                {[
                  'Đặt một tờ giấy trắng lên sàn nhà, sát vào bức tường.',
                  'Đứng lên tờ giấy sao cho gót chân chạm nhẹ vào tường.',
                  'Dùng bút chì đánh dấu điểm xa nhất của ngón chân lên tờ giấy.',
                  'Dùng thước đo khoảng cách từ mép giấy (tường) đến điểm vừa đánh dấu.',
                  'So sánh kết quả đo (cm) với bảng quy đổi bên cạnh.'
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shrink-0 mt-1">{i + 1}</span>
                    <p className="text-zinc-600 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-blue-50 rounded-[40px] border border-blue-100">
                <p className="text-blue-900 font-bold text-sm italic">
                  Mẹo: Nên đo vào buổi chiều hoặc tối vì lúc này chân sẽ có kích thước lớn nhất sau một ngày hoạt động.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="bg-zinc-50 rounded-[40px] p-8 md:p-12 shadow-inner border border-zinc-100">
              <h3 className="text-xl font-black uppercase tracking-widest text-center mb-10">Bảng quy đổi size Nike</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">Chiều dài (CM)</th>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">US</th>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">UK</th>
                      <th className="py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">EUR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-100 last:border-none hover:bg-white transition-colors">
                        <td className="py-4 font-black text-black">{row.cm}</td>
                        <td className="py-4 font-bold text-zinc-500">{row.us}</td>
                        <td className="py-4 font-bold text-zinc-500">{row.uk}</td>
                        <td className="py-4 font-black text-blue-600">{row.eur}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
