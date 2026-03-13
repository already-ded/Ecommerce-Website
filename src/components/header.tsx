'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserMenu } from './UserMenu';
import { useRouter } from 'next/navigation';
import { NotiDropdown } from './NotiDropdown';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useCartStore } from  "src/store/cart_actions";

export function Header() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const cart = useCartStore((state) => state.cart);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const { isLoggedIn, user, isLoading } = useAuth();

  const handleSellerChannelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/auth/signin');
      return;
    }

    const shopStatus = user?.shopStatus;
    switch (shopStatus) {
      case 'active':
        router.push('/seller/dashboard');
        break;
      case 'pending':
        alert('Hồ sơ đăng ký bán hàng của bạn đang trong quá trình kiểm duyệt. Vui lòng đợi trong 24h!');
        break;
      case 'rejected':
        if (confirm('Hồ sơ của bạn đã bị từ chối. Bạn có muốn gửi lại hồ sơ không?')) {
          router.push('/auth/business-signup');
        }
        break;
      default:
        router.push('/auth/business-signup');
        break;
    }
  };

  const renderAuthStatus = () => {
    if (isLoading) {
      return (
        <div
          className='flex items-center justify-center text-[#555]'
          style={{ width: '24px', height: '24px' }}
          aria-label='Đang tải...'></div>
      );
    }

    if (isLoggedIn && user) {
      return <UserMenu user={user} />;
    }

    return (
      <Link
        href='/auth/signin'
        className='flex items-center justify-center text-[#555] hover:text-sky-500'
        aria-label='Tài khoản'>
        <FaUser />
      </Link>
    );
  };

  return (
    <header>
      {/* Header Top - Responsive */}
      <div className='flex items-center justify-between border-b border-[#e6e6e6] bg-[#f8f8f8] px-3 py-2 text-sm text-[#555] md:px-[8%] md:text-base'>
        {/* Left: Freeship - Ẩn text trên mobile */}
        <div className='flex items-center'>
          <img src='/freeship.png' alt='Miễn phí ship logo' className='mr-1 h-4 md:mr-2 md:h-6' />
          <p className='m-0 hidden text-[#555] sm:block'>
            <b className='mr-1 text-sky-700'>Miễn phí ship</b>đơn chỉ từ 45k
          </p>
          {/* Text ngắn cho mobile */}
          <p className='m-0 text-xs text-[#555] sm:hidden'>
            <b className='text-sky-700'>Freeship</b> đơn từ 45k
          </p>
        </div>

        {/* Right: Notification + Seller */}
        <div className='flex items-center gap-2 md:gap-3.5'>
          <div
            className='flex cursor-pointer items-center justify-center border-0 bg-transparent text-lg text-[#555] hover:text-sky-500 md:text-[24px]'
            aria-label='Xem thông báo'>
            <NotiDropdown />
          </div>
          <button
            onClick={handleSellerChannelClick}
            className='flex cursor-pointer items-center gap-0.5 text-[#555] hover:text-sky-600 md:text-[14px]'>
            <span className='hidden sm:inline md:ml-4'>Kênh người bán</span>
            <span className='ml-4 sm:hidden'>Kênh bán</span>
          </button>
        </div>
      </div>

      {/* Header Main - Responsive */}
      <div className='border-b border-[#ddd] bg-white'>
        <div className='mx-auto flex max-w-full items-center justify-between px-3 py-3 md:my-5 md:px-5'>
          {/* Logo */}
          <div className='mr-2 md:mr-[60px]'>
            <Link href='/'>
              <img src='/logo.jpg' alt='Logo' className='h-[35px] md:h-[60px]' />
            </Link>
          </div>

          {/* Search Bar - Responsive */}
          <div className='mx-2 flex flex-1 items-center md:mx-5 md:scale-90'>
            <label htmlFor='search' className='sr-only'></label>
            <input
              type='text'
              id='search'
              placeholder='Tìm kiếm sản phẩm...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={onKeyDown}
              className='h-[35px] w-full rounded-l-[10px] border border-[#ccc] px-3 text-sm focus:border-[rgb(25,122,173)] focus:outline-none md:h-[45px] md:px-4 md:text-[18px]'
            />
            <button
              id='btnSearch'
              aria-label='Tìm kiếm'
              onClick={handleSearch}
              className='flex h-[35px] items-center justify-center rounded-r-[10px] border border-[#ccc] bg-sky-500 px-3 text-white hover:bg-sky-700 md:h-[45px] md:px-4'>
              <FaSearch className='text-sm md:text-base' />
            </button>
          </div>

          {/* Icons - Cart & User */}
          <div className='flex items-center gap-3 md:gap-8'>
            <Link
              href='/cart'
              className='relative flex items-center text-xl text-[#333] no-underline md:text-[24px]'
              aria-label='Giỏ hàng'>
              <FaShoppingCart className='hover:text-sky-500' />
              <span className='absolute -right-2 -top-1 rounded-full bg-red-600 px-1 py-0.5 text-[10px] font-bold text-white md:-right-2.5 md:-top-1.5 md:px-1.5 md:text-[11px]'>
                {totalQuantity}
              </span>
            </Link>
            <div className='text-xl md:text-[24px]'>{renderAuthStatus()}</div>
          </div>

          {/* Mobile Menu Button - Chỉ hiện trên mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='ml-2 flex items-center justify-center text-xl text-[#333] md:hidden'
            aria-label='Menu'>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className='hidden md:block'>
        <ul
          id='menuItems'
          className='m-0 flex list-none flex-row items-center justify-center gap-[70px] bg-[rgba(200,236,255,0.4)] font-sans'>
          <li>
            <Link
              className='block px-5 py-[15px] font-semibold text-[rgb(1,62,95)] no-underline hover:bg-[rgb(163,218,248)]'
              href='/'>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              className='block px-5 py-[15px] font-semibold text-[rgb(1,62,95)] no-underline hover:bg-[rgb(163,218,248)]'
              href='/products'>
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link
              className='block px-5 py-[15px] font-semibold text-[rgb(1,62,95)] no-underline hover:bg-[rgb(163,218,248)]'
              href='/sale'>
              Khuyến mãi
            </Link>
          </li>
          <li>
            <Link
              className='block px-5 py-[15px] font-semibold text-[rgb(1,62,95)] no-underline hover:bg-[rgb(163,218,248)]'
              href='/about'>
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link
              className='block px-5 py-[15px] font-semibold text-[rgb(1,62,95)] no-underline hover:bg-[rgb(163,218,248)]'
              href='/faq'>
              Hỗ trợ
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className='bg-[rgba(200,236,255,0.4)] md:hidden'>
          <ul className='m-0 list-none'>
            <li>
              <Link
                className='block border-b border-white/20 px-5 py-3 font-semibold text-[rgb(1,62,95)] no-underline active:bg-[rgb(163,218,248)]'
                href='/'
                onClick={() => setIsMobileMenuOpen(false)}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                className='block border-b border-white/20 px-5 py-3 font-semibold text-[rgb(1,62,95)] no-underline active:bg-[rgb(163,218,248)]'
                href='/products'
                onClick={() => setIsMobileMenuOpen(false)}>
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                className='block border-b border-white/20 px-5 py-3 font-semibold text-[rgb(1,62,95)] no-underline active:bg-[rgb(163,218,248)]'
                href='/sale'
                onClick={() => setIsMobileMenuOpen(false)}>
                Khuyến mãi
              </Link>
            </li>
            <li>
              <Link
                className='block border-b border-white/20 px-5 py-3 font-semibold text-[rgb(1,62,95)] no-underline active:bg-[rgb(163,218,248)]'
                href='/about'
                onClick={() => setIsMobileMenuOpen(false)}>
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link
                className='block border-b border-white/20 px-5 py-3 font-semibold text-[rgb(1,62,95)] no-underline active:bg-[rgb(163,218,248)]'
                href='/contact'
                onClick={() => setIsMobileMenuOpen(false)}>
                Liên hệ
              </Link>
            </li>
            <li>
              <Link
                className='block px-5 py-3 font-semibold text-[rgb(1,62,95)] no-underline active:bg-[rgb(163,218,248)]'
                href='/faq'
                onClick={() => setIsMobileMenuOpen(false)}>
                Hỗ trợ
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
