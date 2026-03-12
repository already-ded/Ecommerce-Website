'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaGift, FaBell, FaTag, FaShoppingBasket } from 'react-icons/fa';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    title: 'Giao hàng thành công',
    desc: 'Đơn hàng #TIBI-88921 đã được giao thành công. Hãy đánh giá để nhận xu!',
    time: 'Vừa xong',
    isUnread: true,
  },
  {
    id: 2,
    type: 'voucher',
    title: 'Voucher 50k dành riêng cho bạn',
    desc: 'Sử dụng mã TIBIKI50 cho đơn từ 200k. Hạn dùng 2 ngày.',
    time: '2 giờ trước',
    isUnread: true,
  },
  {
    id: 3,
    type: 'product',
    title: 'iPhone 16 Pro Max đã về hàng',
    desc: 'Ưu đãi trả góp 0% cho thành viên Tibiki. Khám phá ngay!',
    time: '1 ngày trước',
    isUnread: false,
  },
  {
    id: 4,
    type: 'order',
    title: 'Đơn hàng đang chuẩn bị',
    desc: 'Shop đang đóng gói đơn hàng #TIBI-99002 của bạn.',
    time: '1 ngày trước',
    isUnread: false,
  },
  {
    id: 5,
    type: 'offer',
    title: 'Siêu sale cuối năm 2024',
    desc: 'Giảm giá lên đến 70% mọi ngành hàng. Chỉ duy nhất hôm nay!',
    time: '2 ngày trước',
    isUnread: false,
  },
];

export function NotiDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // Click outside -> close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isUnread: false })));
  };

  return (
    <div className='relative inline-block' ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`-right-5 relative flex cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-2 transition-all ${
          isOpen ? 'bg-cyan-50 text-[#00bcd4]' : 'text-[#333] hover:bg-gray-100 hover:text-sky-500'
        }`}>
        <FaBell />
        {unreadCount > 0 && (
          <span className='absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[8px] font-black text-white shadow-sm'>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className='animate-in fade-in slide-in-from-top-2 absolute right-0 top-full z-110 mt-3 w-[360px] overflow-hidden rounded-2xl border border-[#eee] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] duration-300 max-sm:fixed max-sm:inset-x-0 max-sm:top-16 max-sm:mt-0 max-sm:w-full max-sm:rounded-none'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-[#f0f0f0] bg-[#fcfcfd] px-5 py-4'>
            <h3 className='text-sm font-bold tracking-widest text-gray-800'>Thông báo mới</h3>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className='cursor-pointer border-none bg-transparent text-[12px] font-bold text-[#00bcd4] hover:underline'>
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div className='scrollbar-thin max-h-[400px] overflow-y-auto max-sm:max-h-[65vh]'>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex cursor-pointer gap-4 border-b border-gray-100 p-4 transition-colors last:border-none hover:bg-sky-50 ${
                  notif.isUnread ? 'bg-cyan-100/30' : ''
                }`}>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notif.type === 'order'
                      ? 'bg-orange-100 text-orange-600'
                      : notif.type === 'voucher'
                        ? 'bg-emerald-100 text-emerald-600'
                        : notif.type === 'product'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-rose-100 text-rose-600'
                  }`}>
                  {notif.type === 'order' && <FaShoppingBasket />}
                  {notif.type === 'voucher' && <FaGift />}
                  {(notif.type === 'product' || notif.type === 'offer') && <FaTag />}
                </div>
                <div className='min-w-0 flex-1'>
                  <p
                    className={`truncate text-[13px] leading-snug ${
                      notif.isUnread ? 'font-bold text-gray-900' : 'text-gray-600'
                    }`}>
                    {notif.title}
                  </p>
                  <p className='mt-1 line-clamp-2 text-[11px] leading-relaxed text-gray-400'>{notif.desc}</p>
                  <p className='mt-1.5 text-[10px] font-medium text-gray-300'>{notif.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className='border-t border-gray-100 p-3 text-center'>
            <Link
              href='/account/notifications'
              className='text-sm font-bold uppercase tracking-widest text-gray-400 no-underline transition-colors hover:text-[#00bcd4]'>
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
