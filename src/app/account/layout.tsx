'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import {
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaLock,
  FaBell,
  FaShoppingCart,
  FaChevronRight,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

function AccountSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;
  const isAdmin = user?.role === 'admin';

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <nav className='box-border border-r border-[#f0f0f0] pr-0 md:pr-5'>
      {/* Profile Header */}
      <div className='mb-5 flex items-center gap-3 border-b border-[#f0f0f0] p-3 pb-4 md:gap-[15px] md:p-2.5 md:pb-5'>
        <img
          src={user?.avatar || 'https://placehold.co/100x100?text=Avatar'}
          alt='Avatar'
          className='h-12 w-12 rounded-full border-2 border-[#eee] object-cover md:h-[50px] md:w-[50px]'
        />
        <div className='flex flex-col'>
          <span className='text-xs text-[#333] md:text-[0.95rem]'>Tài khoản của</span>
          <strong className='max-w-[150px] truncate text-sm font-semibold text-[#333] md:text-base'>
            {user?.email}
          </strong>
        </div>
      </div>

      {/* Menu Items */}
      <div className='flex flex-col'>
        <Link
          href='/account/profile'
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline transition-colors md:px-2.5 md:py-3.5 md:text-base ${
            isActive('/account/profile')
              ? 'bg-[#f0f5ff] font-semibold text-[#074262]'
              : 'text-[#333] hover:bg-[#f5f5f5]'
          }`}>
          <div className={isActive('/account/profile') ? 'text-[#074262]' : ''}>
            <FaUser />
          </div>{' '}
          Hồ Sơ
        </Link>

        {!isAdmin && (
          <>
            <Link
              href='/orders'
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline transition-colors md:px-2.5 md:py-3.5 md:text-base ${
                isActive('/account/orders')
                  ? 'bg-[#f0f5ff] font-semibold text-[#074262]'
                  : 'text-[#333] hover:bg-[#f5f5f5]'
              }`}>
              <div className={isActive('/account/orders') ? 'text-[#074262]' : ''}>
                <FaShoppingCart />
              </div>{' '}
              Đơn Hàng
            </Link>
            <Link
              href='/account/payment'
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline transition-colors md:px-2.5 md:py-3.5 md:text-base ${
                isActive('/account/payment')
                  ? 'bg-[#f0f5ff] font-semibold text-[#074262]'
                  : 'text-[#333] hover:bg-[#f5f5f5]'
              }`}>
              <div className={isActive('/account/payment') ? 'text-[#074262]' : ''}>
                <FaCreditCard />
              </div>{' '}
              Ngân Hàng
            </Link>
            <Link
              href='/account/address'
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline transition-colors md:px-2.5 md:py-3.5 md:text-base ${
                isActive('/account/address')
                  ? 'bg-[#f0f5ff] font-semibold text-[#074262]'
                  : 'text-[#333] hover:bg-[#f5f5f5]'
              }`}>
              <div className={isActive('/account/address') ? 'text-[#074262]' : ''}>
                <FaMapMarkerAlt />
              </div>{' '}
              Địa Chỉ
            </Link>
          </>
        )}

        <Link
          href='/account/password'
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline transition-colors md:px-2.5 md:py-3.5 md:text-base ${
            isActive('/account/password')
              ? 'bg-[#f0f5ff] font-semibold text-[#074262]'
              : 'text-[#333] hover:bg-[#f5f5f5]'
          }`}>
          <div className={isActive('/account/password') ? 'text-[#074262]' : ''}>
            <FaLock />
          </div>{' '}
          Đổi Mật Khẩu
        </Link>
        <Link
          href='/account/notifications'
          onClick={handleLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm no-underline transition-colors md:px-2.5 md:py-3.5 md:text-base ${
            isActive('/account/notifications')
              ? 'bg-[#f0f5ff] font-semibold text-[#074262]'
              : 'text-[#333] hover:bg-[#f5f5f5]'
          }`}>
          <div className={isActive('/account/notifications') ? 'text-[#074262]' : ''}>
            <FaBell />
          </div>{' '}
          Thông Báo
        </Link>

        {isAdmin && (
          <Link
            href='/admin'
            onClick={handleLinkClick}
            className='mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#333] no-underline hover:bg-[#f5f5f5] md:px-2.5 md:py-3.5 md:text-base'>
            <FaTachometerAlt /> Trang Admin
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading || !isLoggedIn) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <p className='text-sm font-semibold text-gray-500 md:text-base'>Đang tải trang...</p>
      </div>
    );
  }

  const getBreadcrumbText = () => {
    if (pathname.endsWith('/profile')) return 'Hồ Sơ Của Tôi';
    if (pathname.endsWith('/payment')) return 'Ngân Hàng';
    if (pathname.endsWith('/address')) return 'Địa Chỉ';
    if (pathname.endsWith('/password')) return 'Mật Khẩu';
    if (pathname.endsWith('/orders')) return 'Đơn Hàng';
    if (pathname.endsWith('/notifications')) return 'Thông Báo';
    return 'Tài khoản';
  };

  return (
    <div className='min-h-screen bg-white font-sans text-black'>
      {/* Breadcrumb */}
      <nav className='mx-auto my-3 box-border hidden max-w-[1200px] items-center gap-2 px-4 text-sm font-[550] text-[#777] md:my-5 md:flex md:px-[15px] md:text-base'>
        <Link href='/' className='text-[#2563eb] no-underline hover:underline'>
          Trang chủ
        </Link>
        <div className='text-[0.65rem] text-[#999] md:text-[0.75rem]'>
          <FaChevronRight />
        </div>
        <span className='text-xs md:text-sm'>{getBreadcrumbText()}</span>
      </nav>

      {/* Mobile Menu Button */}
      <div className='mx-auto mt-4 max-w-[1200px] px-4 pb-3 md:hidden'>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50'>
          <span className='flex items-center gap-2'>
            <FaBars />
            Thông tin tài khoản
          </span>
          <FaChevronRight className={`transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden' onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className='absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl'
            onClick={(e) => e.stopPropagation()}>
            <div className='overflow-y-auto p-4' style={{ maxHeight: 'calc(100vh - 80px)' }}>
              <AccountSidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className='mx-auto my-6 box-border grid max-w-[1200px] grid-cols-1 gap-4 px-4 md:my-10 md:grid-cols-[250px_1fr] md:gap-[30px] md:px-5'>
        {/* Desktop Sidebar */}
        <div className='hidden md:block'>
          <AccountSidebar />
        </div>

        {/* Content Area */}
        <div className='min-h-[400px] bg-white md:min-h-[600px]'>
          {children || (
            <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-10 text-gray-300'>
              <div className='mb-4 text-4xl'>
                <FaUser />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
