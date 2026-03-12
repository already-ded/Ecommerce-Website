'use client';

import React from 'react';
import { FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaLocationDot, FaPhone, FaEnvelope } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className='mt-10 bg-[#111] px-5 py-10 font-sans text-[#eee]'>
      {/* - grid-cols-2: Hiển thị 2 cột trên mobile (tạo thành 2 hàng cho 4 mục)
        - lg:grid-cols-4: Trở lại 4 cột trên desktop
      */}
      <div className='mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 md:gap-10 lg:grid-cols-4'>
        {/* Cột 1: Thương hiệu & Social */}
        <div className='col-span-2 flex flex-col lg:col-span-1'>
          <h2 className='mb-3 text-xl font-bold text-sky-400 md:text-[24px]'>Tibiki</h2>
          <p className='mb-4 text-[11px] leading-relaxed text-[#ccc] md:text-sm'>
            Khám phá thế giới mua sắm trực tuyến tiện lợi, chất lượng và đáng tin cậy cùng Tibiki.
          </p>
          <div className='flex items-center gap-2'>
            <a
              href='#'
              aria-label='Facebook'
              className='flex h-8 w-8 items-center justify-center rounded-full border border-[#333] bg-[#222] text-white transition-all hover:bg-sky-500 md:h-[38px] md:w-[38px]'>
              <FaFacebookF size={14} />
            </a>
            <a
              href='#'
              aria-label='Instagram'
              className='flex h-8 w-8 items-center justify-center rounded-full border border-[#333] bg-[#222] text-white transition-all hover:bg-sky-500 md:h-[38px] md:w-[38px]'>
              <FaInstagram size={14} />
            </a>
            <a
              href='#'
              aria-label='Twitter'
              className='flex h-8 w-8 items-center justify-center rounded-full border border-[#333] bg-[#222] text-white transition-all hover:bg-sky-500 md:h-[38px] md:w-[38px]'>
              <FaXTwitter size={14} />
            </a>
            <a
              href='#'
              aria-label='TikTok'
              className='flex h-8 w-8 items-center justify-center rounded-full border border-[#333] bg-[#222] text-white transition-all hover:bg-sky-500 md:h-[38px] md:w-[38px]'>
              <FaTiktok size={14} />
            </a>
          </div>
        </div>

        {/* Cột 2: Hỗ trợ khách hàng */}
        <div>
          <h4 className="relative mb-4 inline-block text-sm font-bold text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-6 after:bg-sky-400 after:content-[''] md:text-lg md:after:w-8">
            Hỗ trợ
          </h4>
          <ul className='list-none space-y-2 p-0'>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Trợ giúp
              </a>
            </li>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Mua hàng
              </a>
            </li>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Đơn hàng
              </a>
            </li>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Đổi trả
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Về Tibiki */}
        <div>
          <h4 className="relative mb-4 inline-block text-sm font-bold text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-6 after:bg-sky-400 after:content-[''] md:text-lg md:after:w-8">
            Về Tibiki
          </h4>
          <ul className='list-none space-y-2 p-0'>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Giới thiệu
              </a>
            </li>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Tuyển dụng
              </a>
            </li>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Điều khoản
              </a>
            </li>
            <li>
              <a
                className='text-[11px] text-[#ccc] no-underline transition-colors hover:text-sky-400 md:text-sm'
                href='#'>
                Bảo mật
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div className='col-span-2 mt-4 lg:col-span-1 lg:mt-0'>
          <h4 className="relative mb-4 inline-block text-sm font-bold text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-6 after:bg-sky-400 after:content-[''] md:text-lg md:after:w-8">
            Liên hệ
          </h4>
          <div className='space-y-3'>
            <div className='flex items-start text-[11px] leading-tight text-[#ccc] md:text-sm'>
              <FaLocationDot className='mr-2 mt-1 shrink-0 text-sky-400' size={14} />
              <span>Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</span>
            </div>
            <div className='flex items-center text-[11px] leading-tight text-[#ccc] md:text-sm'>
              <FaPhone className='mr-2 shrink-0 text-sky-400' size={14} />
              <span>+84 123 456 789</span>
            </div>
            <div className='flex items-center text-[11px] leading-tight text-[#ccc] md:text-sm'>
              <FaEnvelope className='mr-2 shrink-0 text-sky-400' size={14} />
              <span>support@tibiki.vn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className='mx-auto mt-10 max-w-7xl border-t border-[#222] pt-6 text-center text-[10px] text-[#777] md:text-sm'>
        <p>© 2025 Tibiki. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
