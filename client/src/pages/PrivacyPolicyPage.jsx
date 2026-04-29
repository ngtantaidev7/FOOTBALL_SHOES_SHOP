import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal>
          <div className="mb-20">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              CHÍNH SÁCH <br /> <span className="text-zinc-300">BẢO MẬT.</span>
            </h1>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed">
              Tại Nike Football Store, quyền riêng tư của bạn là ưu tiên hàng đầu. Chúng tôi cam kết bảo vệ thông tin cá nhân và cung cấp một môi trường mua sắm an toàn nhất.
            </p>
          </div>
        </ScrollReveal>

        <div className="prose prose-zinc max-w-none space-y-12 text-zinc-600 font-medium leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. Thu thập thông tin</h2>
            <p>Chúng tôi thu thập thông tin khi bạn đăng ký tài khoản, đặt hàng, hoặc đăng ký nhận bản tin. Thông tin bao gồm: tên, email, số điện thoại, địa chỉ giao hàng và lịch sử mua sắm.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Sử dụng thông tin</h2>
            <p>Thông tin thu thập được sử dụng để: xử lý đơn hàng, cải thiện dịch vụ khách hàng, cá nhân hóa trải nghiệm người dùng và gửi thông tin cập nhật về các sản phẩm mới nhất.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. Bảo mật dữ liệu</h2>
            <p>Chúng tôi sử dụng các công nghệ mã hóa SSL tiên tiến để đảm bảo an toàn cho dữ liệu thanh toán của bạn. Thông tin cá nhân được lưu trữ trong môi trường an toàn và chỉ có nhân viên được ủy quyền mới có quyền truy cập.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Chia sẻ với bên thứ ba</h2>
            <p>Chúng tôi cam kết không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ các đối tác vận chuyển tin cậy để phục vụ quá trình giao hàng.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">5. Quyền của người dùng</h2>
            <p>Bạn có quyền truy cập, sửa đổi hoặc yêu cầu xóa thông tin cá nhân của mình bất kỳ lúc nào thông qua trang quản lý tài khoản hoặc liên hệ trực tiếp với bộ phận hỗ trợ của chúng tôi.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
