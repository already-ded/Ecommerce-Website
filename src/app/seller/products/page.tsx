'use client';

import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
  FaBox,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  stock?: number;
}

const initialFormState: Product = {
  id: '',
  name: '',
  image: '',
  category: '',
  price: 0,
  oldPrice: 0,
  rating: 5.0,
  stock: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Product>(initialFormState);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      const mappedData = data.map((p: any) => ({
        ...p,
        category: p.category || 'Chưa phân loại',
        stock: p.stock !== undefined ? p.stock : 100,
      }));

      setProducts(mappedData);
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaginationItems = (current: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 3) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const handleAddNew = () => {
    setFormData({ ...initialFormState, id: Date.now().toString() });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      rating: parseFloat(formData.rating?.toString() || '0'),
    };

    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === formData.id ? formData : p)));
      alert(`Đã cập nhật (giả lập): ${formData.name}`);
    } else {
      setProducts((prev) => [formData, ...prev]);
      alert(`Đã thêm mới (giả lập): ${formData.name}`);
    }

    setShowModal(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    if (type === 'number' || ['price', 'oldPrice', 'stock', 'rating'].includes(name)) {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        parsedValue = 0;
      }
    }

    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: parsedValue,
        }) as Product,
    );
  };

  const allFilteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(allFilteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  const displayedProducts = allFilteredProducts.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatPrice = (price: number) => price?.toLocaleString('vi-VN') + ' VNĐ';

  if (isLoading) {
    return <div className='p-4 text-center md:p-8'>Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className='p-0'>
      <h1 className='mb-4 border-b border-gray-200 px-4 pb-3 text-xl font-bold text-gray-800 md:mb-6 md:px-0 md:pb-4 md:text-2xl'>
        Quản lý Sản phẩm
      </h1>

      {/* Search & Add Button - Responsive */}
      <div className='mx-4 mb-4 flex flex-col items-stretch justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center md:mx-0 md:mb-6 md:p-4'>
        <div className='relative w-full sm:max-w-96'>
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400' />
        </div>

        <button
          onClick={handleAddNew}
          className='flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'>
          <FaPlus /> Thêm Sản phẩm
        </button>
      </div>

      {/* Table - Desktop View */}
      <div className='mx-4 hidden overflow-x-auto rounded-lg border border-gray-200 bg-white p-5 shadow md:mx-0 lg:block'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Mã SP
              </th>
              <th
                className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'
                style={{ width: '250px' }}>
                Sản phẩm
              </th>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Danh mục
              </th>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Giá gốc
              </th>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Giá bán
              </th>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Đánh giá
              </th>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Tồn kho
              </th>
              <th className='border-b-2 border-gray-200 px-4 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-wider text-gray-600'>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className='py-6 text-center text-gray-500'>
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              displayedProducts.map((product) => (
                <tr key={product.id} className='hover:bg-[#fcfcfd]'>
                  <td className='border-b px-4 py-3 align-middle text-sm text-gray-600'>{product.id}</td>
                  <td className='border-b px-4 py-3 align-middle text-sm text-gray-600'>
                    <div className='flex items-center gap-3'>
                      <img src={product.image} alt={product.name} className='h-10 w-10 shrink-0 rounded object-cover' />
                      <span className='font-semibold leading-tight text-gray-800'>{product.name}</span>
                    </div>
                  </td>
                  <td className='border-b px-4 py-3 align-middle text-sm text-gray-600'>{product.category}</td>
                  <td className='border-b px-4 py-3 align-middle text-xs text-gray-400 line-through'>
                    {product.oldPrice ? formatPrice(product.oldPrice) : '-'}
                  </td>
                  <td className='border-b px-4 py-3 align-middle text-sm font-bold text-red-500'>
                    {formatPrice(product.price)}
                  </td>
                  <td className='border-b px-4 py-3 align-middle text-sm text-gray-600'>
                    <div className='flex items-center text-xs text-amber-500'>
                      <FaStar /> ({product.rating?.toFixed(1) || 0})
                    </div>
                  </td>
                  <td className='border-b px-4 py-3 align-middle text-sm text-gray-600'>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        (product.stock || 0) > 50
                          ? 'bg-emerald-100 text-emerald-800'
                          : (product.stock || 0) > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-800'
                      }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className='border-b px-4 py-3 align-middle text-sm text-gray-600'>
                    <div className='flex justify-end gap-1'>
                      <button
                        onClick={() => handleEdit(product)}
                        className='cursor-pointer rounded p-1.5 text-blue-600 hover:bg-blue-50'
                        title='Chỉnh sửa'>
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className='cursor-pointer rounded p-1.5 text-red-500 hover:bg-red-100'
                        title='Xóa'>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card View - Mobile/Tablet */}
      <div className='space-y-3 px-4 md:px-0 lg:hidden'>
        {displayedProducts.length === 0 ? (
          <div className='rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500'>
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          displayedProducts.map((product) => (
            <div key={product.id} className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
              {/* Header with image and name */}
              <div className='mb-3 flex items-start gap-3'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='h-16 w-16 shrink-0 rounded object-cover sm:h-20 sm:w-20'
                />
                <div className='min-w-0 flex-1'>
                  <h3 className='mb-1 line-clamp-2 text-sm font-semibold text-gray-800 sm:text-base'>{product.name}</h3>
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <span className='rounded bg-gray-100 px-2 py-0.5'>{product.category}</span>
                    <span className='text-gray-400'>#{product.id}</span>
                  </div>
                </div>
              </div>

              {/* Price and Rating */}
              <div className='mb-3 flex items-center justify-between border-b border-gray-100 pb-3'>
                <div>
                  {product.oldPrice && (
                    <div className='mb-0.5 text-xs text-gray-400 line-through'>{formatPrice(product.oldPrice)}</div>
                  )}
                  <div className='text-base font-bold text-red-500 sm:text-lg'>{formatPrice(product.price)}</div>
                </div>
                <div className='flex items-center gap-1 text-sm text-amber-500'>
                  <FaStar />
                  <span className='font-medium'>{product.rating?.toFixed(1) || 0}</span>
                </div>
              </div>

              {/* Stock and Actions */}
              <div className='flex items-center justify-between'>
                <div className='text-xs text-gray-600'>
                  Tồn kho:{' '}
                  <span
                    className={`ml-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      (product.stock || 0) > 50
                        ? 'bg-emerald-100 text-emerald-800'
                        : (product.stock || 0) > 0
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-800'
                    }`}>
                    {product.stock}
                  </span>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEdit(product)}
                    className='cursor-pointer rounded p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100'
                    title='Chỉnh sửa'>
                    <FaEdit className='text-base' />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className='cursor-pointer rounded p-2 text-red-500 hover:bg-red-50 active:bg-red-100'
                    title='Xóa'>
                    <FaTrash className='text-base' />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className='mx-4 mt-4 flex flex-col items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row md:mx-0 md:mt-5 md:p-4'>
          <span className='text-center text-xs text-gray-500 sm:text-left sm:text-sm'>
            Hiển thị {startIndex + 1} - {Math.min(endIndex, allFilteredProducts.length)} / {allFilteredProducts.length}{' '}
            sản phẩm
          </span>
          <div className='flex flex-wrap justify-center gap-1 sm:gap-2'>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-gray-300 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:border-gray-200 disabled:opacity-40 sm:h-9 sm:w-9'
              title='Trang trước'>
              <FaChevronLeft className='text-xs' />
            </button>

            {getPaginationItems(currentPage, totalPages).map((item, index) =>
              typeof item === 'number' ? (
                <button
                  key={index}
                  onClick={() => goToPage(item)}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-gray-300 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800 sm:h-9 sm:w-9 sm:text-sm ${currentPage === item ? 'pointer-events-none border-blue-600 bg-blue-600 font-semibold text-white' : ''}`}>
                  {item}
                </button>
              ) : (
                <span
                  key={index}
                  className='hidden h-8 w-8 select-none items-end justify-center pb-1.5 font-bold text-gray-400 sm:flex sm:h-8 sm:w-8'>
                  ...
                </span>
              ),
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-gray-300 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:border-gray-200 disabled:opacity-40 sm:h-9 sm:w-9'
              title='Trang sau'>
              <FaChevronRight className='text-xs' />
            </button>
          </div>
        </div>
      )}

      {/* Modal - Responsive */}
      {showModal && (
        <div className='fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[83vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl'>
            <div className='sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4'>
              <h2 className='flex items-center gap-2 text-lg font-bold text-gray-800 sm:text-xl'>
                <FaBox style={{ color: '#3b82f6' }} className='text-base sm:text-xl' />
                <span className='text-base sm:text-xl'>{isEditing ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='cursor-pointer p-1 text-xl text-gray-400 hover:text-gray-600'>
                <FaTimes />
              </button>
            </div>

            <div className='p-4 sm:p-6'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5'>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='name'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Tên Sản phẩm
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Ví dụ: Áo thun Polo cao cấp'
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                  />
                </div>

                <div>
                  <label
                    htmlFor='price'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Giá bán (VNĐ)
                  </label>
                  <input
                    type='number'
                    name='price'
                    id='price'
                    value={formData.price || ''}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    min='0'
                  />
                </div>
                <div>
                  <label
                    htmlFor='oldPrice'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Giá gốc (nếu có)
                  </label>
                  <input
                    type='number'
                    name='oldPrice'
                    id='oldPrice'
                    value={formData.oldPrice || ''}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    min='0'
                  />
                </div>

                <div>
                  <label
                    htmlFor='category'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Danh mục
                  </label>
                  <select
                    name='category'
                    id='category'
                    value={formData.category}
                    onChange={handleChange}
                    className='w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'>
                    <option value=''>Chọn danh mục</option>
                    <option value='Gia dụng'>Gia dụng</option>
                    <option value='Điện tử'>Điện tử</option>
                    <option value='Thời trang'>Thời trang</option>
                    <option value='Sách'>Sách</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor='stock'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Tồn kho
                  </label>
                  <input
                    type='number'
                    name='stock'
                    id='stock'
                    value={formData.stock || ''}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    min='0'
                  />
                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='rating'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Đánh giá (0.0 - 5.0)
                  </label>
                  <input
                    type='number'
                    name='rating'
                    id='rating'
                    value={formData.rating || ''}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    min='0'
                    max='5'
                    step='0.1'
                  />
                </div>
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='image'
                    className='mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-gray-700'>
                    Link Ảnh Sản phẩm
                  </label>
                  <input
                    type='text'
                    name='image'
                    id='image'
                    value={formData.image}
                    onChange={handleChange}
                    className='w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-black transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                    placeholder='Ví dụ: https://images.com/ao-thun.jpg'
                  />
                </div>
              </div>

              <div className='mt-6 flex flex-col justify-end gap-3 border-t border-gray-100 pt-4 sm:mt-8 sm:flex-row sm:pt-6'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='order-2 cursor-pointer rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] sm:order-1'>
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className='order-1 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:bg-emerald-700 active:scale-[0.98] sm:order-2'>
                  <FaSave /> {isEditing ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
