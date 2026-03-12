'use client';
import { useRef, useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth, MockUser } from '../context/AuthContext';

export function UserMenu({ user }: { user: MockUser }) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Xử lý đóng menu khi nhấn ra ngoài vùng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative inline-block' ref={menuRef}>
      <div
        className='flex cursor-pointer items-center justify-center text-[#555] hover:text-sky-500'
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        aria-label='Tài khoản'>
        <div
          className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-transparent bg-gray-200 shadow-sm transition-all md:h-8 md:w-8 ${isOpen ? 'border-[#08c2f5]' : ''}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt='User Avatar' className='h-full w-full object-cover' />
          ) : (
            <FaUser className='h-3.5 w-3.5 md:h-4 md:w-4' />
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className='z-100 absolute right-0 top-full w-[220px] rounded-lg border border-[#eee] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.1)]'
          onMouseLeave={() => setIsOpen(false)}>
          <p className='mt-0 border-b border-[#f0f0f0] pb-2 text-sm font-semibold'>Chào, {user.email}!</p>
          <ul className='mt-2 list-none p-0'>
            <li>
              <Link
                className='block w-full rounded p-2 text-left text-[16px] text-[#333] no-underline hover:bg-[#f5f5f5]'
                href='/account/profile'>
                Thông tin tài khoản
              </Link>
            </li>
            <li>
              <Link
                className='block w-full rounded p-2 text-left text-[16px] text-[#333] no-underline hover:bg-[#f5f5f5]'
                href='/orders'>
                Đơn hàng của tôi
              </Link>
            </li>

            <li>
              <button
                onClick={logout}
                className='block w-full cursor-pointer rounded border-0 bg-transparent p-2 text-left text-[16px] text-[#333] hover:bg-[#f5f5f5]'>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
