'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductList from 'src/components/ProductList';
import { FaFire, FaRocket, FaChevronRight } from 'react-icons/fa'; // Cài react-icons

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  const featured = data.slice(0, 4);

  return (
    <main className='flex min-h-screen flex-col items-center bg-[#f5f5fa] pb-12'>
      {/* 1. HERO BANNER - Nâng cấp với Gradient và Nút bấm */}
      <section className='mt-6 w-full max-w-[1120px] px-4'>
        <div className='relative flex h-72 w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-blue-400 text-white shadow-xl'>
          <div className='absolute right-[-10%] top-[-20%] h-64 w-64 rounded-full bg-white/10 blur-3xl'></div>
          <div className='absolute bottom-[-20%] left-[-10%] h-64 w-64 rounded-full bg-black/10 blur-3xl'></div>

          <span className='mb-4 rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-md'>Mùa giảm giá 2026</span>
          <h2 className='text-center text-[2.5rem] font-bold leading-tight drop-shadow-md md:text-[3.5rem]'>
            SALE ĐẬM CUỐI NĂM!
          </h2>
          <p className='mt-2 text-lg opacity-90'>Giảm đến 50% cho tất cả thiết bị điện tử</p>
          <button className='mt-6 transform cursor-pointer rounded-full bg-white px-8 py-3 font-bold text-blue-600 transition hover:-translate-y-1 hover:shadow-lg'>
            Săn Deal Ngay
          </button>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className='mt-12 w-full max-w-[1120px] px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FaFire className='text-2xl text-red-500' />
            <h3 className='text-2xl font-bold text-gray-800'>Sản phẩm nổi bật</h3>
          </div>
          <Link href='/products' className='flex items-center gap-1 font-semibold text-blue-600 hover:underline'>
            Tất cả <FaChevronRight size={12} />
          </Link>
        </div>

        {/* Danh sách sản phẩm */}
        <div className='grid grid-cols-2 gap-6 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]'>
          <ProductList products={featured} />
        </div>

        {/* Nút Xem thêm */}
        <div className='mt-10 flex w-full justify-center'>
          <Link href='/products'>
            <button className='group relative cursor-pointer overflow-hidden rounded-xl border-2 border-blue-600 bg-white px-10 py-3 text-base font-bold text-blue-600 transition'>
              <span className='relative z-10'>Khám phá toàn bộ cửa hàng</span>
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
