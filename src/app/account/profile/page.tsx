'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaTrash,
  FaShieldAlt,
} from 'react-icons/fa';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

export default function ProfilePage() {
  const { user, isLoading: authLoading, updateAvatar } = useAuth();

  const [profile, setProfile] = useState({
    fullName: '',
    nickname: '',
    dob_day: '1',
    dob_month: '1',
    dob_year: '2000',
    gender: 'other',
    nationality: 'VN',
    phone: '',
    email: user?.email,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);
  const [editingField, setEditingField] = useState<'phone' | 'email' | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Tải dữ liệu từ API
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        const data = await response.json();

        if (response.ok) {
          setProfile({
            ...data,
            email: user.email || data.email || '',
          });
        }
      } catch (error) {
        console.error('Lỗi khi fetch hồ sơ:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (!authLoading) {
      loadProfile();
    }
  }, [user?.id, user?.email, authLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert('Không tìm thấy người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...profile,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || 'Cập nhật hồ sơ thành công!');
      } else {
        alert(result.error || 'Lỗi: ' + (result.details || 'Không rõ nguyên nhân'));
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = () => {
    const newAvatarUrl = window.prompt('Nhập URL hình ảnh mới:', 'https://i.pravatar.cc/150?u=' + user?.id);

    if (newAvatarUrl && newAvatarUrl.trim() !== '') {
      updateAvatar(newAvatarUrl);
      alert('Đã cập nhật Avatar!');
    }
  };

  const openEditModal = (field: 'phone' | 'email') => {
  setEditingField(field);
  setTempValue(field === 'phone' ? profile.phone ?? '' : profile.email ?? '');
  setShowContactModal(true);
};

  const handleSaveContact = async () => {
    if (!tempValue) {
      alert('Vui lòng nhập thông tin!');
      return;
    }

    if (editingField === 'phone' && !/^\d{10,11}$/.test(tempValue)) {
      alert('Số điện thoại không hợp lệ!');
      return;
    }
    if (editingField === 'email' && !/\S+@\S+\.\S+/.test(tempValue)) {
      alert('Email không hợp lệ!');
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1000));

    setProfile((prev) => ({ ...prev, [editingField!]: tempValue }));
    setIsSaving(false);
    setShowContactModal(false);
    setEditingField(null);
    alert(`Đã cập nhật ${editingField === 'phone' ? 'số điện thoại' : 'email'} thành công!`);
  };

  return (
    <div>
      {/* Page Title */}
      <h1 className='m-0 mb-6 border-b border-[#eee] pb-4 text-xl font-semibold md:mb-2 md:pb-3 md:text-2xl'>
        Thông tin tài khoản
      </h1>

      {/* Grid Layout - 1 cột mobile, 2 cột desktop */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-[3fr_2fr] md:gap-8'>
        {/* Left Column - Profile Card */}
        <div className='bg-white p-5 md:border-r md:border-[#eee] md:p-6'>
          <h2 className='mb-4 text-base font-semibold md:mb-6 md:text-lg'>Thông tin cá nhân</h2>

          {/* Avatar Section */}
          <div className='mb-6 flex flex-col items-center md:mb-8'>
            <img
              src={user?.avatar || 'https://placehold.co/100x100?text=...'}
              alt='Avatar'
              className='md:border-3 mb-3 h-20 w-20 rounded-full border-2 border-[#eee] object-cover md:mb-4 md:h-24 md:w-24'
            />
            <button
              onClick={handleAvatarChange}
              className='cursor-pointer rounded border border-[#ccc] bg-none px-4 py-2 text-sm text-[#555] hover:bg-[#f5f5f5] md:text-base'>
              Chọn ảnh
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveProfile} className='space-y-4 md:space-y-5'>
            {/* Full Name */}
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
              <label htmlFor='fullName' className='w-full font-medium text-[#585858] md:w-32 md:text-left'>
                Họ & Tên
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                className='flex-1 rounded-lg border border-gray-300 p-2 text-sm text-black md:p-2.5 md:text-base'
                value={profile.fullName}
                onChange={handleInputChange}
                placeholder='Nhập họ và tên'
                required
              />
            </div>

            {/* Nickname */}
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
              <label htmlFor='nickname' className='w-full font-medium text-[#585858] md:w-32 md:text-left'>
                Nickname
              </label>
              <input
                type='text'
                id='nickname'
                name='nickname'
                className='flex-1 rounded-lg border border-gray-300 p-2 text-sm text-black md:p-2.5 md:text-base'
                value={profile.nickname}
                onChange={handleInputChange}
                placeholder='Tên hiển thị'
              />
            </div>

            {/* Date of Birth */}
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
              <label className='w-full font-medium text-[#585858] md:w-32 md:text-left'>Ngày sinh</label>
              <div className='flex flex-1 gap-2 md:gap-2.5'>
                <select
                  name='dob_day'
                  value={profile.dob_day}
                  onChange={handleInputChange}
                  className='flex-1 rounded-lg border border-gray-300 p-2 text-sm text-black md:p-2.5 md:text-base'>
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  name='dob_month'
                  value={profile.dob_month}
                  onChange={handleInputChange}
                  className='flex-1 rounded-lg border border-gray-300 p-2 text-sm text-black md:p-2.5 md:text-base'>
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
                <select
                  name='dob_year'
                  value={profile.dob_year}
                  onChange={handleInputChange}
                  className='flex-1 rounded-lg border border-gray-300 p-2 text-sm text-black md:p-2.5 md:text-base'>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender */}
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
              <label className='w-full font-medium text-[#585858] md:w-32 md:text-left'>Giới tính</label>
              <div className='flex flex-1 gap-4 md:gap-5'>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='gender'
                    value='male'
                    checked={profile.gender === 'male'}
                    onChange={handleInputChange}
                    className='h-4 w-4'
                  />
                  <span className='text-sm md:text-base'>Nam</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='gender'
                    value='female'
                    checked={profile.gender === 'female'}
                    onChange={handleInputChange}
                    className='h-4 w-4'
                  />
                  <span className='text-sm md:text-base'>Nữ</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name='gender'
                    value='other'
                    checked={profile.gender === 'other'}
                    onChange={handleInputChange}
                    className='h-4 w-4'
                  />
                  <span className='text-sm md:text-base'>Khác</span>
                </label>
              </div>
            </div>

            {/* Nationality */}
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
              <label htmlFor='nationality' className='w-full font-medium text-[#585858] md:w-32 md:text-left'>
                Quốc tịch
              </label>
              <select
                id='nationality'
                name='nationality'
                value={profile.nationality}
                onChange={handleInputChange}
                className='flex-1 rounded-lg border border-gray-300 p-2 text-sm text-black md:p-2.5 md:text-base'>
                <option value='VN'>Việt Nam</option>
                <option value='US'>Mỹ</option>
                <option value='JP'>Nhật Bản</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
              <div className='hidden md:block md:w-32'></div>
              <button
                type='submit'
                disabled={isSaving}
                className='w-full cursor-pointer rounded-lg border-none bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-[#9ca3af] md:w-40 md:text-base'>
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Security Card */}
        <div className='bg-white p-5 md:p-6'>
          <h2 className='mb-4 mt-0 text-base font-semibold md:mb-6 md:text-lg'>Số điện thoại và Email</h2>

          {/* Phone */}
          <div className='flex items-center border-b border-[#f0f0f0] py-4 md:py-5'>
            <FaPhone className='mr-4 w-7 shrink-0 text-xl text-[#999] md:mr-5 md:text-2xl' />
            <div className='flex-1'>
              <span className='block text-sm text-[#777] md:text-base'>Số điện thoại</span>
              <strong className='text-sm font-medium text-black md:text-base'>
                {profile.phone || 'Chưa cập nhật'}
              </strong>
            </div>
            <button
              onClick={() => openEditModal('phone')}
              className='ml-2 whitespace-nowrap rounded-lg border border-[#2563eb] bg-white px-3 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#f0f5ff] md:px-4 md:text-sm'>
              Cập nhật
            </button>
          </div>

          {/* Email */}
          <div className='flex items-center border-b border-[#f0f0f0] py-4 md:py-5'>
            <FaEnvelope className='mr-4 w-7 shrink-0 text-xl text-[#999] md:mr-5 md:text-2xl' />
            <div className='min-w-0 flex-1'>
              <span className='block text-sm text-[#777] md:text-base'>Địa chỉ email</span>
              <strong className='block truncate text-sm font-medium text-black md:text-base'>{profile.email}</strong>
            </div>
            <button
              onClick={() => openEditModal('email')}
              className='ml-2 whitespace-nowrap rounded-lg border border-[#2563eb] bg-white px-3 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#f0f5ff] md:px-4 md:text-sm'>
              Cập nhật
            </button>
          </div>

          <h2 className='mb-4 mt-6 text-base font-semibold md:mb-6 md:mt-8 md:text-lg'>Bảo mật</h2>

          {/* PIN */}
          <div className='flex items-center border-b border-[#f0f0f0] py-4 md:py-5'>
            <FaShieldAlt className='mr-4 w-7 shrink-0 text-xl text-[#999] md:mr-5 md:text-2xl' />
            <div className='flex-1'>
              <span className='block text-sm text-[#777] md:text-base'>Thiết lập mã PIN</span>
            </div>
            <button className='ml-2 whitespace-nowrap rounded-lg border border-[#2563eb] bg-white px-3 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#f0f5ff] md:px-4 md:text-sm'>
              Cập nhật
            </button>
          </div>

          {/* Delete Account */}
          <div className='flex items-center py-4 md:py-5'>
            <FaTrash className='mr-4 w-7 shrink-0 text-xl text-[#999] md:mr-5 md:text-2xl' />
            <div className='flex-1'>
              <span className='block text-sm text-[#777] md:text-base'>Yêu cầu xóa tài khoản</span>
            </div>
            <button className='ml-2 whitespace-nowrap rounded-lg border border-[#2563eb] bg-white px-3 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#f0f5ff] md:px-4 md:text-sm'>
              Yêu cầu
            </button>
          </div>
        </div>
      </div>

      {/* Contact Edit Modal */}
      {showContactModal && (
        <div className='animate-in fade-in fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm duration-200 ease-out'>
          <div className='animate-in fade-in zoom-in-[0.8] w-[400px] max-w-[90%] overflow-hidden rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]'>
            <div className='flex flex-col gap-5 p-6 md:p-8'>
              <h3 className='m-0 text-base font-medium text-[#333] md:text-lg'>
                {editingField === 'phone' ? 'Số điện thoại' : 'Địa chỉ Email'}
              </h3>

              <div className='relative flex items-center'>
                {editingField === 'phone' && <FaPhone className='absolute left-3 text-base text-[#999]' />}
                {editingField === 'email' && <FaEnvelope className='absolute left-3 text-base text-[#999]' />}

                <input
                  type={editingField === 'phone' ? 'tel' : 'email'}
                  className='w-full rounded-md border border-[#ddd] py-3 pl-10 pr-3 text-sm outline-none transition-all focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] md:text-base'
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={editingField === 'phone' ? 'Nhập số điện thoại mới' : 'Nhập email mới'}
                  autoFocus
                />
              </div>

              <button
                onClick={handleSaveContact}
                disabled={isSaving}
                className='cursor-pointer rounded-md border-none bg-[#0d6efd] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0b5ed7] md:text-base'>
                {isSaving ? 'Đang xác thực...' : 'Lưu thay đổi'}
              </button>

              <button
                onClick={() => setShowContactModal(false)}
                className='cursor-pointer rounded-md border border-[#eee] bg-none px-4 py-3 text-sm text-[#777] hover:opacity-90 md:text-base'>
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
