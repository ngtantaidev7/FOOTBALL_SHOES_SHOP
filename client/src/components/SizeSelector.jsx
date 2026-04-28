import { useState } from 'react';

export default function SizeSelector({ sizes = [], selected, onChange }) {
  const [showGuide, setShowGuide] = useState(false);
  return (
    <div>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <span className='text-sm font-bold text-gray-900 uppercase tracking-wide'>
            Chọn size (EU)
          </span>
          <button 
            onClick={() => setShowGuide(true)}
            className='text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition'
          >
            Bảng quy đổi size
          </button>
        </div>
        {selected && (
          <span className='text-sm text-zinc-500'>
            Đã chọn: <strong className='text-black'>EU {selected}</strong>
          </span>
        )}
      </div>

      <div className='grid grid-cols-5 sm:grid-cols-6 gap-2'>
        {sizes.map(({ size, stock }) => {
          const isSelected = selected === size;
          const isOutOfStock = stock === 0;

          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onChange(size)}
              disabled={isOutOfStock}
              title={
                isOutOfStock ? 'Hết hàng' : `Size ${size} — còn ${stock} đôi`
              }
              className={`
                relative aspect-square rounded-xl border-2 text-sm font-bold
                flex items-center justify-center transition-all duration-200
                ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-lg scale-105'
                    : isOutOfStock
                      ? 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through'
                      : 'border-zinc-300 bg-white text-gray-800 hover:border-black hover:shadow-md cursor-pointer'
                }
              `}
            >
              {size}
              {isOutOfStock && (
                <span className='absolute inset-0 flex items-center justify-center'>
                  <span className='block w-full h-px bg-zinc-300 rotate-45 absolute' />
                </span>
              )}
              {!isOutOfStock && stock <= 2 && !isSelected && (
                <span className='absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full' />
              )}
            </button>
          );
        })}
      </div>

      <div className='flex items-center gap-4 mt-3 text-xs text-zinc-400'>
        <span className='flex items-center gap-1'>
          <span className='w-3 h-3 border-2 border-zinc-300 rounded inline-block' />{' '}
          Hết hàng
        </span>
        <span className='flex items-center gap-1'>
          <span className='w-1.5 h-1.5 bg-red-500 rounded-full inline-block' />{' '}
          Sắp hết (≤ 2 đôi)
        </span>
      </div>

      {/* Size Guide Modal */}
      {showGuide && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
          <div className='bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200'>
            <button 
              onClick={() => setShowGuide(false)}
              className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition text-zinc-500 hover:text-black font-bold'
            >
              ✕
            </button>
            <h3 className='text-2xl font-black mb-2'>Bảng quy đổi size giày Nike</h3>
            <p className='text-zinc-500 mb-6 text-sm'>Đo chiều dài bàn chân của bạn từ gót đến ngón dài nhất để chọn size chuẩn xác.</p>
            
            <div className='overflow-x-auto rounded-xl border border-zinc-200'>
              <table className='w-full text-sm text-left'>
                <thead className='bg-zinc-50 text-zinc-500 uppercase font-bold text-xs'>
                  <tr>
                    <th className='px-6 py-4'>Size EU</th>
                    <th className='px-6 py-4'>Size US (Nam)</th>
                    <th className='px-6 py-4'>Size UK</th>
                    <th className='px-6 py-4'>Chiều dài chân</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-zinc-100'>
                  {[
                    { eu: 38, us: 5.5, uk: 5, cm: 24 },
                    { eu: 39, us: 6.5, uk: 6, cm: 24.5 },
                    { eu: 40, us: 7, uk: 6.5, cm: 25 },
                    { eu: 41, us: 8, uk: 7.5, cm: 26 },
                    { eu: 42, us: 8.5, uk: 8, cm: 26.5 },
                    { eu: 43, us: 9.5, uk: 9, cm: 27.5 },
                    { eu: 44, us: 10, uk: 9.5, cm: 28 },
                    { eu: 45, us: 11, uk: 10.5, cm: 29 },
                  ].map(row => (
                    <tr key={row.eu} className='hover:bg-zinc-50 transition'>
                      <td className='px-6 py-4 font-black text-black'>{row.eu}</td>
                      <td className='px-6 py-4'>{row.us}</td>
                      <td className='px-6 py-4'>{row.uk}</td>
                      <td className='px-6 py-4 font-bold text-blue-600'>{row.cm} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className='mt-6 bg-blue-50 text-blue-900 p-4 rounded-xl text-sm leading-relaxed'>
              <p><strong>💡 Mẹo nhỏ:</strong> Nếu bàn chân của bạn có form bè (to ngang) hoặc mu bàn chân dày, hãy cân nhắc chọn tăng thêm 0.5 đến 1 size so với chiều dài thực tế để mang lại cảm giác thoải mái nhất khi thi đấu nhé.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
