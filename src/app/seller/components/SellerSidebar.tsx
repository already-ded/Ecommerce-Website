'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import {
  FaThLarge,
  FaBox,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaEye,
  FaUser,
  FaTimes,
} from 'react-icons/fa';

const sellerNavItems = [
  { href: '/seller/dashboard', icon: FaThLarge, label: 'Tổng quan' },
  { href: '/seller/products', icon: FaBox, label: 'Sản phẩm' },
  { href: '/seller/orders', icon: FaClipboardList, label: 'Đơn hàng' },
  { href: '/seller/setting', icon: FaCog, label: 'Cấu hình Shop' },
];

interface SellerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerSidebar({ isOpen, onClose }: SellerSidebarProps) {
  const { user, logout } = useAuth();
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);

  return (
    <>
      {/* Lớp nền mờ trên Mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 z-100 cursor-pointer bg-black/40 backdrop-blur-sm transition-opacity md:hidden'
          onClick={onClose}
        />
      )}

      {/* Container Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-110 flex h-screen w-[260px] flex-col bg-white shadow-xl transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Section - Chỉnh font bớt đậm */}
        <div className='flex items-center justify-between bg-linear-to-r from-[#1159a5] to-[#078edd] px-6 py-5 text-white'>
          <div className='flex items-center gap-3'>
            <div className='rounded-lg bg-white/20 p-2'>
              <FaStore className='text-lg' />
            </div>
            <div>
              <h2 className='text-lg font-bold italic leading-none tracking-tight'>Tibiki</h2>
              <p className='mt-1 text-[10px] uppercase tracking-wider text-blue-100 opacity-80'>Kênh Người Bán</p>
            </div>
          </div>
          {/* Nút đóng cho Mobile */}
          <button
            onClick={onClose}
            className='flex cursor-pointer items-center justify-center rounded border-0 bg-transparent p-1 text-white hover:bg-white/10 md:hidden'>
            <FaTimes size={18} />
          </button>
        </div>

        {/* Profile Shop */}
        <div className='flex items-center gap-3 border-b border-blue-50 bg-[#f5f9ff] p-4'>
          <div className='h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#1A94FF]/30 bg-white'>
            {user?.avatar ? (
              <img src={user.avatar} alt='Avatar' className='h-full w-full object-cover' />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-[#1A94FF]'>
                <FaUser />
              </div>
            )}
          </div>
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium text-[#0B74E5]'>{user?.name || 'Đối tác Shop'}</p>
            <p className='truncate text-[11px] text-slate-500'>{user?.email}</p>
          </div>
        </div>

        {/* Navigation - Font medium cho nhẹ nhàng */}
        <nav className='scrollbar-hide mt-4 flex flex-1 flex-col gap-1 overflow-y-auto px-3'>
          {sellerNavItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-[14px] no-underline transition-all ${
                  isActive
                    ? ' bg-[#f0f5ff] font-semibold text-[#0B74E5]'
                    : 'font-medium text-[#555] hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <item.icon
                  className={`text-lg transition-colors ${isActive ? 'text-[#0B74E5]' : 'text-slate-400 group-hover:text-slate-600'}`}
                />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Footer */}
        <div className='space-y-1 border-t border-slate-50 px-3 pb-5 pt-4'>
          <a
            href='/shop'
            className='flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-600 no-underline transition-colors hover:bg-slate-50 hover:text-slate-900'>
            <FaEye className='text-slate-400' />
            Xem Gian Hàng
          </a>

          <button
            onClick={logout}
            className='flex w-full cursor-pointer items-center gap-3 rounded-xl border-0 bg-[#e8f2ff] px-4 py-3 text-sm font-medium text-[#0B74E5] outline-none transition hover:bg-[#dbeaff]'>
            <FaSignOutAlt />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
