'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  ShieldCheck,
  User,
  MapPin,
  Ban,
  Loader2,
  Phone,
  Mail,
  Store,
  FileText,
} from 'lucide-react';

const REJECT_REASONS = [
  'Thông tin doanh nghiệp không hợp lệ',
  'Mã số thuế không chính xác',
  'Giấy tờ pháp lý thiếu/không rõ ràng',
  'Địa chỉ kho hàng không xác thực được',
  'Lĩnh vực kinh doanh không phù hợp',
  'Thông tin liên hệ không chính xác',
  'Lý do khác',
];

const TabItem = ({ id, label, count, active, set }: any) => {
  const isActive = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`border-b-3 flex-1 cursor-pointer whitespace-nowrap px-4 py-2.5 text-[16px] font-semibold transition-all md:flex-none ${
        isActive ? 'border-[#046d9e] text-[#0646ac]' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}>
      {label} {count !== undefined && `(${count})`}
    </button>
  );
};

export default function ShopsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'rejected'>('pending');
  const [shops, setShops] = useState<any[]>([]);
  const [allShops, setAllShops] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [shopToReject, setShopToReject] = useState<string | null>(null);

  const fetchAllShops = async () => {
    try {
      const res = await fetch('/api/admin/shops');
      const data = await res.json();
      setAllShops(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching all shops:', error);
    }
  };

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/shops?status=${activeTab}`);
      const data = await res.json();
      setShops(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllShops();
    fetchShops();
  }, [activeTab]);

  const handleApproveShop = async (shopId: string) => {
    if (!confirm('Xác nhận phê duyệt hồ sơ này?')) return;
    try {
      const res = await fetch(`/api/admin/shops/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      if (res.ok) {
        alert('Đã phê duyệt shop thành công!');
        await fetchAllShops();
        await fetchShops();
        setSelectedShop(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectShop = async () => {
    if (!rejectReason) {
      alert('Vui lòng chọn lý do từ chối!');
      return;
    }
    if (rejectReason === 'Lý do khác' && !otherReason.trim()) {
      alert('Vui lòng nhập lý do từ chối cụ thể!');
      return;
    }
    const finalReason = rejectReason === 'Lý do khác' ? otherReason.trim() : rejectReason;
    try {
      const res = await fetch(`/api/admin/shops/${shopToReject}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectReason: finalReason }),
      });
      if (res.ok) {
        alert('Đã từ chối hồ sơ!');
        setShowRejectModal(false);
        setShopToReject(null);
        setSelectedShop(null);
        await fetchAllShops();
        await fetchShops();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBanShop = async (shopId: string) => {
    const reason = prompt('Lý do đình chỉ hoạt động:');
    if (!reason || !reason.trim()) return;
    try {
      const res = await fetch(`/api/admin/shops/${shopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'disabled', banReason: reason.trim() }),
      });
      if (res.ok) {
        alert('Đã khóa shop!');
        await fetchAllShops();
        await fetchShops();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredShops = shops.filter(
    (s) =>
      s.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shopId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.taxCode?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabCounts = {
    pending: allShops.filter((s) => s.status === 'pending').length,
    active: allShops.filter((s) => s.status === 'active').length,
    rejected: allShops.filter((s) => s.status === 'rejected').length,
  };

  return (
    <div className='mx-auto w-full max-w-[1440px] space-y-6 px-4 font-sans text-gray-900 md:px-6'>
      {/* HEADER & TOOLBAR - Responsive: Stack on mobile */}
      <div className='flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-xl font-bold text-gray-800 md:text-2xl'>Duyệt hồ sơ & Quản lý Shop</h1>
        <div className='relative w-full md:w-[400px]'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
          <input
            type='text'
            placeholder='Tìm theo Tên Shop, ID, MST...'
            className='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#005cd4] focus:ring-1'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* TABS - Tối ưu cuộn ngang trên mobile */}
      <div className='scrollbar-hide flex w-full overflow-x-auto border-b border-gray-200'>
        <TabItem id='pending' label='Chờ duyệt' count={tabCounts.pending} active={activeTab} set={setActiveTab} />
        <TabItem id='active' label='Đang hoạt động' count={tabCounts.active} active={activeTab} set={setActiveTab} />
        <TabItem id='rejected' label='Đã từ chối' count={tabCounts.rejected} active={activeTab} set={setActiveTab} />
      </div>

      {/* SHOP LIST */}
      <div className='flex flex-col gap-4'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
            <Loader2 className='mb-2 animate-spin' size={32} />
            <p className='text-sm font-medium'>Đang tải dữ liệu...</p>
          </div>
        ) : filteredShops.length > 0 ? (
          filteredShops.map((shop) => (
            <div
              key={shop.shopId}
              className='flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md lg:flex-row'>
              {/* Cột 1: Logo & ID - Responsive: Flex-row on mobile */}
              <div className='flex shrink-0 items-start gap-4 lg:w-[300px]'>
                <img
                  src={shop.logo || 'https://placehold.co/100x100?text=Shop'}
                  className='h-16 w-16 rounded-lg border border-gray-200 object-cover'
                  alt=''
                />
                <div className='min-w-0'>
                  <h3 className='line-clamp-1 text-[17px] font-bold text-blue-700' title={shop.shopName}>
                    {shop.shopName}
                  </h3>
                  <div className='mt-1 flex flex-col gap-1'>
                    <span className='text-xs font-medium text-gray-500'>
                      ID: <span className='font-mono font-bold text-gray-500'>{shop.shopId}</span>
                    </span>
                    <span className='flex items-center gap-1 text-xs text-gray-400'>
                      <Clock size={12} /> {shop.submittedDate || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cột 2: Thông tin chi tiết (Grid 1 cột on mobile, 2 cột on desktop) */}
              <div className='grid flex-1 grid-cols-1 gap-x-8 gap-y-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0'>
                <InfoRow label='Loại hình' value={shop.businessType} icon={<Building2 size={14} />} />
                <InfoRow label='Mã số thuế' value={shop.taxCode} icon={<ShieldCheck size={14} />} />
                <InfoRow
                  label='Đại diện'
                  value={shop.representative?.fullName || shop.ownerInfo?.fullName}
                  icon={<User size={14} />}
                />
                <InfoRow
                  label='SĐT Liên hệ'
                  value={shop.representative?.phone || shop.ownerInfo?.phone}
                  icon={<Phone size={14} />}
                />
                <div className='sm:col-span-2'>
                  <InfoRow label='Kho hàng' value={shop.warehouseAddress} icon={<MapPin size={14} />} isTruncate />
                </div>
              </div>

              {/* Cột 3: Hành động - Responsive: Flex-row on mobile, flex-col on desktop */}
              <div className='flex min-w-[120px] flex-wrap justify-center gap-2 border-t border-gray-100 pt-4 lg:flex-col lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0'>
                <div className='w-full sm:w-auto lg:w-full'>
                  <ActionButton
                    onClick={() => setSelectedShop(shop)}
                    icon={<Eye size={14} />}
                    label='Xem Chi Tiết'
                    color='bg-gray-100 text-gray-700 hover:bg-gray-200'
                  />
                </div>

                {activeTab === 'pending' && (
                  <>
                    <div className='w-full sm:w-auto lg:w-full'>
                      <ActionButton
                        onClick={() => handleApproveShop(shop.shopId)}
                        icon={<CheckCircle size={14} />}
                        label='Phê Duyệt'
                        color='bg-blue-600 text-white hover:bg-blue-800'
                      />
                    </div>
                    <div className='w-full sm:w-auto lg:w-full'>
                      <ActionButton
                        onClick={() => {
                          setShopToReject(shop.shopId);
                          setShowRejectModal(true);
                          setRejectReason('');
                          setOtherReason('');
                        }}
                        icon={<XCircle size={14} />}
                        label='Từ Chối'
                        color='bg-rose-100 text-red-600 hover:bg-rose-200 border border-rose-200'
                      />
                    </div>
                  </>
                )}

                {activeTab === 'active' && (
                  <div className='w-full sm:w-auto lg:w-full'>
                    <ActionButton
                      onClick={() => handleBanShop(shop.shopId)}
                      icon={<Ban size={14} />}
                      label='Khóa Shop'
                      color='bg-red-600 text-white hover:bg-red-800'
                    />
                  </div>
                )}

                {activeTab === 'rejected' && shop.rejectReason && (
                  <div className='mt-2 w-full rounded border border-red-200 bg-red-50 p-2'>
                    <p className='text-xs font-semibold text-red-800'>Lý do từ chối:</p>
                    <p className='mt-1 text-xs text-red-700'>{shop.rejectReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className='rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center'>
            <Store size={40} className='mx-auto mb-3 text-gray-300' />
            <p className='text-sm font-medium text-gray-500'>
              {searchQuery ? 'Không tìm thấy kết quả' : 'Danh sách trống'}
            </p>
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT SHOP - Tối ưu Mobile padding */}
      {selectedShop && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm md:p-4'>
          <div className='flex max-h-[83vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-2xl md:max-h-[95vh]'>
            <div className='flex items-center justify-between border-b border-gray-200 px-4 py-4 md:px-8 md:py-5'>
              <div className='flex items-center gap-3'>
                <FileText size={20} className='text-[#000ed4]' />
                <h2 className='text-base font-bold uppercase text-gray-800 md:text-lg'>Hồ sơ đăng ký</h2>
              </div>
              <button
                onClick={() => setSelectedShop(null)}
                className='cursor-pointer p-1 font-bold text-red-600 transition-colors hover:text-red-800'>
                ✕
              </button>
            </div>

            <div className='flex-1 overflow-y-auto bg-[#f8f9fb] p-4 md:p-8'>
              <div className='mb-8'>
                <h3 className='text-md mb-4 flex items-center font-bold uppercase tracking-wide text-[#000304] md:text-lg'>
                  <span className='mr-3 h-6 w-1.5 rounded-full bg-[#000ed4]'></span>
                  Thông tin cửa hàng
                </h3>
                <div className='grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-6'>
                  <div className='md:col-span-2'>
                    <FormViewItem label='Tên Shop hiển thị' value={selectedShop.shopName} />
                  </div>
                  <div className='md:col-span-2'>
                    <FormViewItem label='Email kinh doanh' value={selectedShop.businessEmail} />
                  </div>
                  <FormViewItem label='Mã số thuế (nếu có)' value={selectedShop.taxCode} />
                  <FormViewItem label='Loại hình kinh doanh' value={selectedShop.businessType} />
                  <div className='md:col-span-2'>
                    <FormViewItem label='Địa chỉ kho hàng lấy hàng' value={selectedShop.warehouseAddress} fullWidth />
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-md mb-4 flex items-center font-bold uppercase tracking-wide text-[#000304] md:text-lg'>
                  <span className='mr-3 h-6 w-1.5 rounded-full bg-[#000ed4]'></span>
                  Thông tin người đại diện
                </h3>
                <div className='grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-6'>
                  <FormViewItem
                    label='Họ và tên'
                    value={selectedShop.representative?.fullName || selectedShop.ownerInfo?.fullName}
                  />
                  <FormViewItem
                    label='Số điện thoại'
                    value={selectedShop.representative?.phone || selectedShop.ownerInfo?.phone}
                  />
                  <FormViewItem label='Số CMND/CCCD' value={selectedShop.representative?.citizenId || '---'} />
                  <FormViewItem
                    label='Email liên hệ cá nhân'
                    value={selectedShop.representative?.email || selectedShop.ownerInfo?.email}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 border-t border-gray-200 bg-white px-4 py-4 md:flex-row md:justify-end md:px-8 md:py-5'>
              {selectedShop.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      setShopToReject(selectedShop.shopId);
                      setShowRejectModal(true);
                      setSelectedShop(null);
                    }}
                    className='w-full cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-6 py-2.5 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 md:w-auto'>
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApproveShop(selectedShop.shopId)}
                    className='w-full cursor-pointer rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-800 active:scale-95 md:w-auto'>
                    Phê duyệt ngay
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedShop(null)}
                className='w-full cursor-pointer rounded-lg bg-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 md:hidden'>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TỪ CHỐI */}
      {showRejectModal && (
        <div className='fixed inset-0 z-110 flex items-center justify-center bg-black/60 p-4'>
          <div className='w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl'>
            <div className='border-b border-gray-200 bg-gray-50 px-6 py-4 font-bold text-gray-800'>
              Lý do từ chối hồ sơ
            </div>
            <div className='max-h-[60vh] space-y-3 overflow-y-auto p-6'>
              {REJECT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex cursor-pointer items-center gap-3 rounded border p-3 transition-colors ${
                    rejectReason === reason ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                  <input
                    type='radio'
                    name='rejectReason'
                    className='h-4 w-4 accent-blue-600'
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <span className='text-sm text-gray-700'>{reason}</span>
                </label>
              ))}
              {rejectReason === 'Lý do khác' && (
                <textarea
                  className='mt-2 w-full rounded border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  rows={3}
                  placeholder='Nhập lý do từ chối cụ thể...'
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              )}
            </div>
            <div className='flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4'>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setShopToReject(null);
                }}
                className='flex-1 cursor-pointer px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700'>
                Hủy
              </button>
              <button
                onClick={handleRejectShop}
                className='flex-1 cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400'
                disabled={!rejectReason || (rejectReason === 'Lý do khác' && !otherReason.trim())}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- **/

const InfoRow = ({ label, value, icon, isTruncate }: any) => (
  <div className='flex flex-col gap-1'>
    <div className='flex items-center gap-2 text-gray-400'>
      {icon}
      <span className='text-[10px] font-bold uppercase tracking-wider'>{label}</span>
    </div>
    <p className={`text-sm font-medium text-gray-800 ${isTruncate ? 'truncate' : ''}`}>{value || '---'}</p>
  </div>
);

const FormViewItem = ({ label, value, fullWidth }: any) => (
  <div className={fullWidth ? 'w-full' : ''}>
    <p className='mb-1 text-[13px] font-semibold text-gray-400'>{label}</p>
    <div className='wrap-break-word rounded border border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-800'>
      {value || '---'}
    </div>
  </div>
);

const ActionButton = ({ onClick, icon, label, color }: any) => (
  <button
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all active:scale-95 ${color}`}>
    {icon}
    <span>{label}</span>
  </button>
);
