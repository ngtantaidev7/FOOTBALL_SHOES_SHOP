import { Link } from 'react-router-dom';

const links = {
  'Sản phẩm': ['Phantom', 'Mercurial', 'Tiempo', 'Vapor'],
  'Loại sân': ['Sân cỏ tự nhiên (FG)', 'Sân nhân tạo (AG)', 'Sân cứng (TF)'],
  'Hỗ trợ': ['Chính sách đổi trả', 'Hướng dẫn chọn size', 'Liên hệ', 'FAQ'],
};

export default function Footer() {
  return (
    <footer className='bg-black text-white pt-16 pb-8'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800'>
          {/* Brand */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <svg className='w-12 h-12 fill-white' viewBox='0 0 192.756 192.756' xmlns='http://www.w3.org/2000/svg'>
                <path d='M42.741 71.477c-9.881 11.604-19.355 25.994-19.45 36.75-.037 4.047 1.255 7.58 4.354 10.256 4.46 3.854 9.374 5.213 14.264 5.221 7.146.01 14.242-2.873 19.798-5.096 9.357-3.742 112.79-48.659 112.79-48.659.998-.5.811-1.123-.438-.812-.504.126-112.603 30.505-112.603 30.505a24.771 24.771 0 0 1-6.524.934c-8.615.051-16.281-4.731-16.219-14.808.024-3.943 1.231-8.698 4.028-14.291z' />
              </svg>
              <span className='text-xl font-black tracking-widest uppercase'>
                Nike Football
              </span>
            </div>
            <p className='text-zinc-400 text-sm leading-relaxed'>
              Trang bị tốt nhất để chinh phục mọi sân đấu. Chất lượng Nike — tốc
              độ, kiểm soát, đỉnh cao.
            </p>
            <div className='flex gap-3 mt-5'>
              {[
                { name: 'f', url: 'https://www.facebook.com/taif.sthamp/' },
                { name: 'in', url: 'https://www.instagram.com/ngyn.t.tai/' },
                { name: 'yt', url: 'https://www.youtube.com/@Onfeet.review' }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition text-zinc-400 text-sm font-bold'
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className='text-sm font-bold uppercase tracking-widest mb-4'>
                {title}
              </h4>
              <ul className='space-y-2'>
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      to='/shop'
                      className='text-zinc-400 text-sm hover:text-white transition'
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-zinc-500 text-xs'>
          <p>
            © {new Date().getFullYear()} Nike Football Store. All rights
            reserved.
          </p>
          <div className='flex gap-4'>
            <a href='#' className='hover:text-white transition'>
              Chính sách bảo mật
            </a>
            <a href='#' className='hover:text-white transition'>
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
