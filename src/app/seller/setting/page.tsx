'use client';

import React, { useState } from 'react';
import { FaStore, FaMapMarkerAlt, FaUniversity, FaSave, FaCamera } from 'react-icons/fa';

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã cập nhật cấu hình shop thành công!');
    }, 1000);
  };

  return (
    <div className='animate-in fade-in space-y-6 font-sans text-slate-800 duration-500'>
      {/* Header - Font chữ nhẹ nhàng hơn */}
      <div className='border-b border-slate-200 pb-4'>
        <h1 className='text-2xl font-semibold text-slate-800'>Cấu hình Shop</h1>
        <p className='mt-1 text-sm text-slate-400'>Quản lý thông tin hiển thị và vận hành của cửa hàng</p>
      </div>

      {/* Tab Navigation - Tối ưu cuộn ngang trên Mobile */}
      <div className='scrollbar-hide flex w-full overflow-x-auto pb-1'>
        <div className='flex min-w-max gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1'>
          <TabBtn id='profile' label='Hồ sơ' active={activeTab} set={setActiveTab} icon={<FaStore />} />
          <TabBtn id='address' label='Địa chỉ' active={activeTab} set={setActiveTab} icon={<FaMapMarkerAlt />} />
          <TabBtn id='bank' label='Thanh toán' active={activeTab} set={setActiveTab} icon={<FaUniversity />} />
        </div>
      </div>

      {/* Main Form Content */}
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:rounded-4xl'>
        <form onSubmit={handleSave} className='space-y-8 p-5 md:p-8'>
          {/* SECTION: HỒ SƠ SHOP */}
          {activeTab === 'profile' && (
            <div className='animate-in slide-in-from-bottom-2 space-y-8 duration-300'>
              <div className='flex flex-col items-center gap-6 border-b border-slate-50 pb-8 md:flex-row md:items-start md:gap-10'>
                <div className='group relative'>
                  <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-4xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition-colors group-hover:border-sky-400 group-hover:bg-sky-50/30'>
                    <span className='text-[10px] font-bold uppercase tracking-wider'>Logo Shop</span>
                  </div>
                  <button
                    type='button'
                    className='absolute -bottom-1 -right-1 cursor-pointer rounded-xl border-none bg-sky-500 p-2.5 text-white shadow-lg outline-none transition-all hover:bg-sky-600 active:scale-90'>
                    <FaCamera size={14} />
                  </button>
                </div>

                <div className='w-full flex-1 space-y-5'>
                  <div>
                    <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                      Tên hiển thị của Shop
                    </label>
                    <input
                      type='text'
                      defaultValue='MiniShop'
                      className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400 focus:bg-white'
                    />
                  </div>
                  <div>
                    <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                      Mô tả ngắn
                    </label>
                    <textarea
                      rows={3}
                      defaultValue='Chuyên cung cấp các sản phẩm thời trang nam nữ cao cấp, cam kết chất lượng 100%.'
                      className='w-full resize-none rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-medium text-slate-600 outline-none transition-all focus:border-sky-400 focus:bg-white'
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Email chăm sóc khách hàng
                  </label>
                  <input
                    type='email'
                    defaultValue='support@minishop.vn'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Số điện thoại hỗ trợ
                  </label>
                  <input
                    type='tel'
                    defaultValue='0988 123 456'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ĐỊA CHỈ LẤY HÀNG */}
          {activeTab === 'address' && (
            <div className='animate-in slide-in-from-bottom-2 space-y-6 duration-300'>
              <div className='flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/50 p-4'>
                <FaMapMarkerAlt className='mt-0.5 shrink-0 text-sky-500' size={14} />
                <p className='text-[11px] font-medium leading-relaxed text-sky-800'>
                  Địa chỉ này sẽ được cung cấp cho đơn vị vận chuyển. Vui lòng đảm bảo thông tin chính xác.
                </p>
              </div>
              <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                <div className='md:col-span-2'>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Họ tên người liên hệ tại kho
                  </label>
                  <input
                    type='text'
                    defaultValue='Nguyễn Văn Admin'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Tỉnh / Thành phố
                  </label>
                  <select className='w-full cursor-pointer appearance-none rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Quận / Huyện
                  </label>
                  <input
                    type='text'
                    defaultValue='Quận 1'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
                <div className='md:col-span-2'>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Địa chỉ chi tiết (Số nhà, tên đường)
                  </label>
                  <input
                    type='text'
                    defaultValue='123 Lê Lợi, Phường Bến Nghé'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: THANH TOÁN */}
          {activeTab === 'bank' && (
            <div className='animate-in slide-in-from-bottom-2 space-y-6 duration-300'>
              <div className='rounded-xl border border-emerald-200 bg-emerald-50/50 p-5'>
                <h3 className='mb-1 text-sm font-semibold text-emerald-800'>Số dư hiện tại: 4,500,000 đ</h3>
                <p className='text-[10px] font-medium italic text-emerald-600'>
                  Tiền doanh thu sẽ được đối soát và chuyển vào tài khoản định kỳ hàng tuần.
                </p>
              </div>
              <div className='space-y-5'>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Tên ngân hàng
                  </label>
                  <input
                    type='text'
                    defaultValue='Vietcombank (VCB)'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Số tài khoản
                  </label>
                  <input
                    type='text'
                    defaultValue='0071000123456'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
                <div>
                  <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                    Tên chủ tài khoản (Viết không dấu)
                  </label>
                  <input
                    type='text'
                    defaultValue='NGUYEN VAN ADMIN'
                    className='w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-sky-400'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className='flex justify-stretch border-t border-slate-100 pt-8 md:justify-end'>
            <button
              type='submit'
              disabled={isSaving}
              className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-sky-100 outline-none transition-all hover:bg-sky-600 active:scale-95 disabled:bg-slate-300 md:w-auto'>
              {isSaving ? (
                'Đang lưu...'
              ) : (
                <>
                  <FaSave /> Lưu cấu hình
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component Nút Tab
const TabBtn = ({ id, label, active, set, icon }: any) => {
  const isActive = active === id;
  return (
    <button
      type='button'
      onClick={() => set(id)}
      className={`flex cursor-pointer items-center gap-2 rounded-xl border-none px-5 py-2 text-[11px] font-bold outline-none transition-all ${
        isActive ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}>
      <span className={isActive ? 'text-sky-600' : 'text-slate-400'}>{icon}</span>
      <span className='uppercase tracking-widest'>{label}</span>
    </button>
  );
};
