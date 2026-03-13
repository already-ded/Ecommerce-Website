'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard, { ProductCardProps } from 'src/components/ui/ProductCard';
import { FaSearch, FaBoxOpen } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  const q = params.get('q') || '';

  const [results, setResults] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const res = await fetch(`/api/products?search=${q}`);
      const data = await res.json();

      const filtered = data.filter((p: any) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );

      setResults(filtered);
      setLoading(false);
    }

    if (q) fetchData();
    else setLoading(false);
  }, [q]);

  if (!q) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center text-gray-500'>
        <FaSearch size={48} className='mb-4 opacity-20' />
        <h2 className='text-xl font-medium'>
          Vui lòng nhập từ khóa để tìm kiếm.
        </h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#f5f5fa] px-4 py-6 md:px-[8%]'>
      <div className='mx-auto max-w-[1300px]'>

        <div className='mb-6'>
          <p className='mb-2 text-sm text-gray-500'>
            Trang chủ / Kết quả tìm kiếm
          </p>

          <h1 className='text-2xl font-bold text-gray-800'>
            Kết quả cho: <span className='text-blue-600'>“{q}”</span>
          </h1>

          {!loading && (
            <p className='mt-1 text-sm text-gray-500'>
              Tìm thấy {results.length} sản phẩm
            </p>
          )}
        </div>

        {loading ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className='h-[350px] animate-pulse rounded-2xl border border-gray-100 bg-white'
              />
            ))}
          </div>
        ) : (
          <>
            {results.length === 0 ? (
              <div className='flex flex-col items-center justify-center rounded-3xl border border-white bg-white p-16 shadow-sm'>
                <div className='mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50'>
                  <FaBoxOpen size={40} className='text-gray-300' />
                </div>

                <h3 className='text-lg font-bold text-gray-800'>
                  Rất tiếc, không tìm thấy sản phẩm phù hợp
                </h3>

                <p className='mt-2 text-center text-gray-500'>
                  Hãy thử sử dụng từ khóa chung hơn hoặc kiểm tra lỗi chính tả.
                </p>

                <button
                  onClick={() => router.push("/")}
                  className='mt-6 rounded-full bg-blue-600 px-8 py-2.5 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700'
                >
                  Quay lại trang chủ
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {results.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}