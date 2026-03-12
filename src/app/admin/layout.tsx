'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, LayoutDashboard, Users, Store, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from 'src/context/AuthContext';

const navigation = [
  { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { name: 'Người dùng', href: '/admin/users', icon: Users },
  { name: 'Duyệt Shop', href: '/admin/shops', icon: Store },
  { name: 'Cấu hình', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) return null;

  if (!user || user.role !== 'admin') {
    router.replace('/');
    return null;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-linear-to-r from-[#1159a5] to-[#078edd] text-white shadow-lg'>
        <div className='mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link href='/admin' className='flex items-center gap-2 sm:gap-3'>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='cursor-pointer rounded-lg p-2 transition hover:bg-white/20 md:hidden'>
                {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
              </button>
              <ShoppingBag className='h-6 w-6 sm:h-8 sm:w-8' />
              <div>
                <h1 className='text-lg font-bold sm:text-2xl'>Tibiki Admin</h1>
                <p className='hidden text-sm text-blue-100 sm:block'>Quản trị hệ thống</p>
              </div>
            </Link>

            {/* Navigation CENTER - Desktop only */}
            <nav className='absolute left-1/2 hidden -translate-x-1/2 lg:block'>
              <div className='flex gap-8'>
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 border-b-2 px-2 py-2 transition-colors ${
                        isActive
                          ? 'border-white text-white'
                          : 'border-transparent text-blue-100 hover:scale-105 hover:text-white'
                      }`}>
                      <item.icon className='h-5 w-5' />
                      <span className='font-medium'>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Desktop User menu */}
            <div className='hidden items-center gap-3 sm:gap-4 md:flex'>
              <div className='text-right'>
                <p className='text-sm font-medium'>{user.name || 'Admin'}</p>
                <p className='text-xs text-blue-100'>{user.email}</p>
              </div>

              <img
                src={user.avatar || 'https://i.pravatar.cc/150?u=admin'}
                alt='Avatar'
                className='h-9 w-9 rounded-full border-2 border-white sm:h-10 sm:w-10'
              />

              <button
                onClick={logout}
                title='Đăng xuất'
                className='cursor-pointer rounded-full p-2 transition hover:scale-105 hover:bg-white/20'>
                <LogOut className='h-5 w-5 text-white sm:h-6 sm:w-6' />
              </button>
            </div>

            {/* Mobile: Avatar + Menu Button */}
            <div className='flex items-center gap-3 md:hidden'>
              <img
                src={user.avatar || 'https://i.pravatar.cc/150?u=admin'}
                alt='Avatar'
                className='h-8 w-8 rounded-full border-2 border-white'
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`relative z-50 overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className='border-t border-white/10 bg-[#0d4a7d]'>
            {/* User Info Mobile */}
            <div className='border-b border-white/10 px-4 py-4'>
              <p className='text-sm font-medium text-white'>{user.name || 'Admin'}</p>
              <p className='mt-0.5 text-xs text-blue-100'>{user.email}</p>
            </div>

            {/* Navigation Mobile */}
            <nav className='py-2'>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive
                        ? 'border-l-4 border-white bg-white/10 text-white'
                        : 'border-l-4 border-transparent text-blue-100 hover:bg-white/5 hover:text-white'
                    }`}>
                    <item.icon className='h-5 w-5' />
                    <span className='font-medium'>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Mobile */}
            <div className='border-t border-white/10 px-4 py-3'>
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className='flex w-full cursor-pointer items-center gap-3 rounded-lg bg-white/10 px-4 py-3 transition-colors hover:bg-white/20'>
                <LogOut className='h-5 w-5 text-white' />
                <span className='font-medium text-white'>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className='mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8'>
        {/* Overlay for mobile menu - click outside to close */}
        {isMobileMenuOpen && (
          <div className='fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden' onClick={closeMobileMenu} />
        )}
        {children}
      </main>
    </div>
  );
}
