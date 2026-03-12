'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductList from 'src/components/ProductList';
import ProductCard, { ProductCardProps } from 'src/components/ui/ProductCard';
import { Filter, X } from 'lucide-react';

export default function Products() {
  useEffect(() => {
    document.title = 'Sản Phẩm';
  }, []);
  const [data, setData] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // States quản lý bộ lọc
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(data.map((p) => p.category)));
    return ['Tất cả', ...uniqueCats.filter(Boolean)];
  }, [data]);

  const filteredProducts = useMemo(() => {
    let result = [...data];

    if (selectedCategory !== 'Tất cả') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (priceRange.min) {
      result = result.filter((p) => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter((p) => p.price <= Number(priceRange.max));
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [data, selectedCategory, priceRange, sortBy]);

  const hasActiveFilters = selectedCategory !== 'Tất cả' || priceRange.min || priceRange.max;

  const FilterContent = () => (
    <>
      {/* Khối Danh mục */}
      <div className='rounded-2xl border border-white bg-white p-4 shadow-sm md:p-6'>
        <h3 className='mb-4 flex items-center justify-between text-sm font-bold text-gray-700 md:mb-5 md:text-base'>
          Danh mục sản phẩm
        </h3>
        <div className='flex flex-col gap-1.5'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat ?? 'Tất cả');
                setShowMobileFilter(false);
              }}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 md:text-[14px] ${
                selectedCategory === cat
                  ? 'translate-x-1 bg-blue-50 font-bold text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Khối Lọc Giá */}
      <div className='rounded-2xl border border-white bg-white p-4 shadow-sm md:p-6'>
        <h3 className='mb-4 text-sm font-bold text-gray-700 md:mb-5 md:text-base'>Khoảng giá</h3>
        <div className='space-y-3'>
          <input
            type='number'
            placeholder='Từ'
            className='w-full rounded-xl border-transparent bg-gray-50 p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500'
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <input
            type='number'
            placeholder='Đến'
            className='w-full rounded-xl border-transparent bg-gray-50 p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500'
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setPriceRange({ min: '', max: '' });
              setSelectedCategory('Tất cả');
              setShowMobileFilter(false);
            }}
            className='mt-4 w-full text-xs font-bold uppercase text-red-400 transition-colors hover:text-red-600 md:mt-5 md:text-[12px]'>
            Xóa tất cả bộ lọc
          </button>
        )}
      </div>
    </>
  );

  return (
    <main className='min-h-screen bg-[#f5f5fa] px-3 py-4 font-sans md:px-4 md:py-8'>
      <div className='mx-auto max-w-[1250px]'>
        {/* THANH CÔNG CỤ TRÊN CÙNG */}
        <div className='mb-4 flex flex-col justify-between gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm md:mb-6 md:flex-row md:items-center md:gap-4 md:p-5'>
          <div className='min-w-0 flex-1'>
            <h1 className='truncate text-lg font-bold uppercase tracking-tight text-gray-800 md:text-xl'>
              {selectedCategory === 'Tất cả' ? 'Tất cả sản phẩm' : selectedCategory}
            </h1>
            <p className='mt-1 text-xs text-gray-400 md:text-sm'>Tìm thấy {filteredProducts.length} sản phẩm</p>
          </div>

          <div className='flex items-center gap-2 md:gap-3'>
            {/* Nút Filter Mobile */}
            <button
              onClick={() => setShowMobileFilter(true)}
              className='flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 active:bg-blue-200 md:hidden'>
              <Filter size={16} />
              Lọc{' '}
              {hasActiveFilters &&
                `(${selectedCategory !== 'Tất cả' ? 1 : 0}${priceRange.min || priceRange.max ? '+' : ''})`}
            </button>

            <span className='hidden text-sm text-gray-700 sm:block'>Sắp xếp:</span>
            <select
              className='cursor-pointer rounded-lg border border-gray-100 bg-gray-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-100 md:p-2.5 md:text-sm'
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value='newest'>Mới nhất</option>
              <option value='price-asc'>Giá thấp → cao</option>
              <option value='price-desc'>Giá cao → thấp</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr] md:gap-8'>
          {/* SIDEBAR BÊN TRÁI - Desktop */}
          <aside className='hidden space-y-6 md:block'>
            <FilterContent />
          </aside>

          {/* MOBILE FILTER MODAL */}
          {showMobileFilter && (
            <div className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden'>
              <div className='fixed inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-[#f5f5fa] shadow-2xl'>
                {/* Header */}
                <div className='sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4'>
                  <h2 className='text-lg font-bold text-gray-800'>Bộ lọc sản phẩm</h2>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className='rounded-lg p-2 transition-colors hover:bg-gray-100'>
                    <X size={20} />
                  </button>
                </div>

                {/* Filter Content */}
                <div className='space-y-4 p-4'>
                  <FilterContent />
                </div>

                {/* Footer Button */}
                <div className='sticky bottom-0 border-t border-gray-200 bg-white p-4'>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className='w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-blue-700 active:bg-blue-800'>
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Overlay để đóng */}
              <div className='absolute inset-0 -z-10' onClick={() => setShowMobileFilter(false)} />
            </div>
          )}

          {/* DANH SÁCH SẢN PHẨM */}
          <section>
            {loading ? (
              <div className='grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-4'>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className='aspect-3/4 animate-pulse rounded-2xl border border-white bg-white shadow-sm'></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className='grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-4'>
                <ProductList products={filteredProducts} />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-white p-12 md:rounded-4xl md:p-20'>
                <img
                  src='https://cdn-icons-png.flaticon.com/512/7486/7486744.png'
                  className='mb-4 w-16 opacity-20 md:w-20'
                  alt=''
                />
                <p className='text-center text-sm font-medium text-gray-400 md:text-base'>
                  Rất tiếc, không tìm thấy sản phẩm nào.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Tất cả');
                    setPriceRange({ min: '', max: '' });
                  }}
                  className='mt-4 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 active:bg-blue-800 md:px-6 md:text-base'>
                  Thử lại
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
