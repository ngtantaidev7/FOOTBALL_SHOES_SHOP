import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function TermsOfUsePage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="mb-20">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              ĐIỀU KHOẢN <br /> <span className="text-zinc-300">SỬ DỤNG.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
              Chào mừng bạn đến với hệ thống cửa hàng trực tuyến Nike Football Store. Việc sử dụng trang web này đồng nghĩa với việc bạn chấp thuận các điều khoản và điều kiện dưới đây.
            </p>
          </div>
        </ScrollReveal>

        <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 font-medium leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. Quyền sở hữu trí tuệ</h2>
            <p>Mọi nội dung trên website bao gồm hình ảnh, logo, văn bản, thiết kế và đồ họa đều thuộc sở hữu của Nike Football Store hoặc các đối tác liên quan, được bảo vệ bởi luật sở hữu trí tuệ.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Quy định đặt hàng</h2>
            <p>Khi đặt hàng, bạn cam kết các thông tin cung cấp là chính xác. Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong trường hợp thông tin không rõ ràng hoặc có dấu hiệu gian lận.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. Giá cả và thanh toán</h2>
            <p>Giá sản phẩm được niêm yết là giá cuối cùng đã bao gồm thuế (nếu có). Chúng tôi hỗ trợ đa dạng phương thức thanh toán an toàn. Trong trường hợp có lỗi về giá, chúng tôi sẽ liên hệ để xác nhận lại với khách hàng.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Trách nhiệm của người dùng</h2>
            <p>Người dùng có trách nhiệm bảo mật thông tin tài khoản và không sử dụng website cho các mục đích bất hợp pháp hoặc gây cản trở đến hoạt động của hệ thống.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">5. Thay đổi điều khoản</h2>
            <p>Chúng tôi có quyền cập nhật, thay đổi điều khoản sử dụng bất kỳ lúc nào mà không cần thông báo trước. Việc tiếp tục sử dụng website sau khi có thay đổi đồng nghĩa với việc bạn chấp thuận các điều khoản mới.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
