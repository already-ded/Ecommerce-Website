'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { SellerSidebar } from './components/SellerSidebar';
import { FaBars, FaUser } from 'react-icons/fa';
import { UserMenu } from 'src/components/UserMenu';

/**
 * Layout bảo mật cho Kênh Người Bán
 * Đã tối ưu Responsive:
 * - Desktop: Sidebar cố định bên trái, nội dung lùi lề 260px.
 * - Mobile: Sidebar ẩn, hiện nút menu ở top bar.
 */
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn || user?.shopStatus !== 'active') {
      // Lưu ý: Không sử dụng alert() nếu có thể, ở đây giữ logic cũ của bạn
      alert('Khu vực chỉ dành cho người bán!');
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [isLoggedIn, isLoading, user, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-50'>
        <div className='mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
        <p className='font-medium italic text-gray-600'>Đang xác thực quyền truy cập Shop...</p>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-[#f4f5f7] font-sans'>
      {/* Sidebar - Điều khiển qua state isSidebarOpen */}
      <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Vùng nội dung chính */}
      <div className='flex min-w-0 flex-1 flex-col transition-all duration-300 md:ml-[260px]'>
        {/* Mobile Top Header - Chỉ hiện trên điện thoại */}
        <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='flex cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-2 text-slate-500 hover:bg-slate-50'>
              <FaBars size={20} />
            </button>
            <span className='text-base font-bold text-slate-800'>Kênh Người Bán</span>
          </div>
          <div className='flex h-8 w-8 items-center justify-center rounded-full'>
           <UserMenu user={user!} />
          </div>
        </header>

        {/* Nội dung trang */}
        <main className='flex-1 p-4 md:p-8'>
          <div className='mx-auto max-w-[1400px]'>{children}</div>
        </main>
      </div>
    </div>
  );
}
