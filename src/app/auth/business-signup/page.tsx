'use client';

import { useState } from 'react';
import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from 'src/context/AuthContext';

export default function BusinessSignupPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  // States quản lý trạng thái gửi form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log('Form data:', data); // Debug: Xem dữ liệu form

    try {
      const response = await fetch('/api/shop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: user?.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message);
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        setError(result.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      setError('Không thể kết nối đến hệ thống. Vui lòng kiểm tra lại mạng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trạng thái chờ khi đang xác thực session
  if (authLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-blue-700 border-t-transparent'></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-[#f4f5f7] p-4 text-center'>
        <h2 className='text-xl font-bold text-gray-800'>Bạn cần đăng nhập trước</h2>
        <p className='mt-2 text-gray-500'>Vui lòng đăng nhập tài khoản của bạn để đăng ký bán hàng.</p>
        <a
          href='/auth/signin'
          className='mt-6 rounded-xl bg-blue-700 px-8 py-3 text-[13px] font-bold uppercase tracking-widest text-white hover:bg-sky-800'>
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-[#f4f5f7] px-4 py-12 font-sans'>
      {/* Header hướng dẫn */}
      <div className='mb-8 max-w-[600px] text-center'>
        <h1 className='text-3xl font-bold text-[#111]'>
          Đăng ký Bán hàng cùng <span className='text-indigo-600'>Tibiki</span>
        </h1>
        <p className='mt-3 text-gray-600'>
          Cung cấp thông tin Shop của bạn để trở thành{' '}
          <span className='font-bold text-indigo-700'>Đối Tác Bán Hàng</span>.
        </p>
      </div>

      <form
        className='box-border flex w-full max-w-[750px] flex-col rounded-xl border border-gray-100 bg-white p-10 shadow-lg'
        onSubmit={onFormSubmit}>
        {/* THÔNG BÁO QUY TRÌNH */}
        <div className='mb-10 flex items-start gap-3 border-l-4 border-blue-500 bg-blue-50 p-4'>
          <div className='mt-0.5 text-blue-800'>
            <FaExclamationCircle />
          </div>
          <p className='text-sm leading-relaxed text-blue-800'>
            Hồ sơ đăng ký sẽ được đội ngũ Tibiki phê duyệt trong vòng 24h.
          </p>
        </div>

        {/* PHẦN 1: THÔNG TIN CỬA HÀNG */}
        <div className='mb-10'>
          <h2 className='mb-6 flex items-center text-xl font-bold text-gray-800'>
            <span className='mr-3 h-6 w-2 rounded-full bg-indigo-600'></span>
            Thông tin cửa hàng / Doanh nghiệp
          </h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='md:col-span-2'>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='businessName'>
                Tên Shop (Amazing/Ladada/ShopBee) <span className='text-red-500'>*</span>
              </label>
              <input
                id='businessName'
                name='businessName'
                type='text'
                className='w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'
                placeholder='Ví dụ: TikiShop'
                required
              />
            </div>

            <div className='md:col-span-2'>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='email'>
                Email đăng ký <span className='text-red-500'>*</span>
              </label>
              <input
                id='email'
                name='email'
                type='email'
                defaultValue={user?.email}
                className='w-full rounded-lg border border-gray-300 bg-indigo-50/30 p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'
                placeholder='Nhập email của bạn'
                required
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='taxCode'>
                Mã số thuế (nếu có)
              </label>
              <input
                id='taxCode'
                name='taxCode'
                type='text'
                className='w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'
                placeholder='Nhập MST để xác minh nhanh hơn'
              />
            </div>

            <div>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='businessType'>
                Loại hình kinh doanh
              </label>
              <select
                id='businessType'
                name='businessType'
                className='w-full cursor-pointer rounded-lg border border-gray-300 bg-white p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'>
                <option>Cá nhân / Hộ kinh doanh</option>
                <option>Công ty TNHH / Cổ phần</option>
                <option>Thương hiệu Quốc tế</option>
              </select>
            </div>

            <div className='md:col-span-2'>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='address'>
                Địa chỉ trụ sở / Kho hàng <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='address'
                name='address'
                defaultValue={user?.address}
                rows={2}
                className='w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'
                placeholder='Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố'
                required></textarea>
            </div>
          </div>
        </div>

        {/* PHẦN 2: NGƯỜI ĐẠI DIỆN */}
        <div className='mb-10'>
          <h2 className='mb-6 flex items-center text-xl font-bold text-gray-800'>
            <span className='mr-3 h-6 w-2 rounded-full bg-indigo-600'></span>
            Thông tin người đại diện
          </h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='fullName'>
                Họ và tên <span className='text-red-500'>*</span>
              </label>
              <input
                id='fullName'
                name='fullName'
                type='text'
                defaultValue={user?.name}
                className='w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'
                placeholder='Tên người liên hệ chính'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='phone'>
                Số điện thoại <span className='text-red-500'>*</span>
              </label>
              <input
                id='phone'
                name='phone'
                type='tel'
                defaultValue={user?.phone}
                className='w-full rounded-lg border border-gray-300 p-3 text-black outline-none transition-all focus:ring-1 focus:ring-indigo-500'
                placeholder='Để chúng tôi liên hệ xác minh'
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <p className='mb-6 rounded-lg border border-red-100 bg-red-50 p-3 text-center text-sm font-medium text-red-500'>
            {error}
          </p>
        )}
        {success && (
          <p className='mb-6 rounded-lg border border-green-100 bg-green-50 p-3 text-center text-sm font-medium text-green-600'>
            {success}
          </p>
        )}

        <div className='mb-8 rounded-lg border border-gray-200 bg-gray-50 p-5'>
          <label className='flex cursor-pointer items-start'>
            <input type='checkbox' className='mr-4 mt-1 h-4 w-4 accent-indigo-600' required />
            <span className='text-sm leading-relaxed text-gray-600'>
              Tôi cam kết thông tin trên là chính xác. Tôi đồng ý nhận thông tin tài khoản qua email và tuân thủ{' '}
              <a href='#' className='font-bold text-indigo-700 underline'>
                Chính sách cộng tác người bán
              </a>
              .
            </span>
          </label>
        </div>

        <button
          type='submit'
          className='cursor-pointer rounded-xl bg-indigo-700 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-800 active:scale-[0.98] disabled:bg-gray-400'
          disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi yêu cầu xét duyệt'}
        </button>
      </form>

      <div className='mt-10 flex items-center space-x-6'>
        <a href='/auth/signin' className='text-sm font-medium text-gray-500 hover:text-indigo-700 hover:underline'>
          Đã có tài khoản? Đăng nhập
        </a>
        <span className='text-gray-300'>|</span>
        <a href='/' className='text-sm font-medium text-gray-500 hover:text-indigo-700 hover:underline'>
          Về trang chủ
        </a>
      </div>
    </div>
  );
}
