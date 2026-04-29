import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function ReturnPolicyPage() {
  const policies = [
    {
      title: 'Thời hạn đổi trả',
      content: 'Khách hàng có thể đổi hoặc trả hàng trong vòng 30 ngày kể từ ngày nhận được sản phẩm.'
    },
    {
      title: 'Điều kiện sản phẩm',
      content: 'Sản phẩm phải còn nguyên tem mác, hộp đựng ban đầu và chưa qua sử dụng (không có dấu hiệu đã đá trên sân, trầy xước đế).'
    },
    {
      title: 'Lý do đổi trả',
      content: 'Hỗ trợ đổi size nếu không vừa hoặc đổi mẫu nếu phát hiện lỗi từ nhà sản xuất. Không áp dụng trả hàng cho các sản phẩm đã qua sử dụng.'
    },
    {
      title: 'Quy trình thực hiện',
      content: 'Liên hệ hotline hoặc gửi email đính kèm hình ảnh sản phẩm. Sau khi xác nhận, quý khách gửi hàng về địa chỉ kho của chúng tôi.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="mb-20">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              CHÍNH SÁCH <br /> <span className="text-zinc-300">ĐỔI TRẢ.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
              Chúng tôi cam kết mang lại sự hài lòng tuyệt đối cho khách hàng với chính sách đổi trả linh hoạt và minh bạch.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {policies.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="border-l-4 border-black pl-8">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{p.title}</h3>
                <p className="text-zinc-600 leading-relaxed font-medium">
                  {p.content}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-20 p-10 bg-zinc-50 rounded-[40px] border border-zinc-100 italic">
            <p className="text-zinc-500">
              * Lưu ý: Các sản phẩm thuộc chương trình khuyến mãi (Sale) có thể có chính sách đổi trả riêng biệt. Vui lòng kiểm tra kỹ thông tin khi thanh toán.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
