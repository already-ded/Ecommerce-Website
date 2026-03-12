'use client';

import React, { useState } from 'react';
import { Store, Truck, Check, X, Eye, ShieldCheck, ChevronRight, Search } from 'lucide-react';

// Dữ liệu giả lập
const MOCK_ORDERS = [
  {
    id: 'TIBI-88921',
    shopName: 'MiniShop Official Store',
    status: 'delivered',
    statusText: 'Đã giao',
    purchaseDate: '2025-12-10',
    totalPrice: 245000,
    items: [
      {
        name: 'Áo Thun Cotton Basic - Màu Trắng - Size L',
        oldPrice: 250000,
        price: 150000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'Tất cổ cao thể thao - Đen',
        oldPrice: 120000,
        price: 95000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1582966772640-31044541c39c?auto=format&fit=crop&w=150&q=80',
      },
    ],
  },
  {
    id: 'TIBI-99002',
    shopName: 'Thời Trang Hè',
    status: 'shipping',
    statusText: 'Đang giao hàng',
    purchaseDate: '2025-12-24',
    totalPrice: 320000,
    items: [
      {
        name: 'Quần Short Jean Nữ - Màu Xanh Nhạt',
        oldPrice: 450000,
        price: 320000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=150&q=80',
      },
    ],
  },
  {
    id: 'TIBI-12034',
    shopName: 'Gia Dụng Luxury',
    status: 'cancelled',
    statusText: 'Đã hủy',
    purchaseDate: '2025-12-15',
    totalPrice: 1250000,
    items: [
      {
        name: 'Máy pha cà phê Espresso mini 2024',
        oldPrice: 1550000,
        price: 1250000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&w=150&q=80',
      },
    ],
  },
];

const CANCEL_REASONS = [
  'Tôi muốn thay đổi địa chỉ nhận hàng/số điện thoại.',
  'Tôi muốn thay đổi phương thức thanh toán.',
  'Tôi muốn đổi size, màu sắc hoặc phân loại sản phẩm.',
  'Tìm thấy giá rẻ hơn ở chỗ khác.',
  'Đổi ý không mua nữa.',
  'Lý do khác.',
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'preparing', label: 'Chờ lấy hàng' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'returned', label: 'Trả hàng' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const filteredOrders = activeTab === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === activeTab);

  return (
    <div className='animate-in fade-in mx-auto max-w-[1100px] space-y-3 pb-10 font-sans text-slate-900 duration-500 md:mt-4 md:space-y-4'>
      {/* Tabs Navigation */}
      <div className='sticky top-0 z-20 overflow-hidden border-b border-gray-200 bg-white md:rounded-xl md:border md:shadow-sm'>
        <div className='scrollbar-hide flex overflow-x-auto whitespace-nowrap'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 cursor-pointer px-5 py-3.5 text-sm font-medium transition-all md:px-6 md:py-4 md:text-[15px] ${
                activeTab === tab.id ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
              {activeTab === tab.id && (
                <div className='absolute bottom-0 left-0 right-0 mx-auto h-[2.5px] w-full bg-sky-600 md:mx-4 md:rounded-full'></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Placeholder */}
      <div className='px-4 md:hidden'>
        <div className='flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-400'>
          <Search size={16} />
          <span className='text-xs'>Tìm kiếm đơn hàng...</span>
        </div>
      </div>

      {/* Orders List */}
      <div className='space-y-3 md:space-y-4'>
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className='border-y border-gray-200 bg-white shadow-sm transition-all md:rounded-2xl md:border md:hover:shadow-md'>
            {/* Header: Shop & Status */}
            <div className='flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 px-4 py-3 md:px-6'>
              <div className='flex items-center gap-2 md:gap-3'>
                {/* Tên Shop - Có thể nhấn để chuyển hướng */}
                <a
                  href={`/shop/${order.shopName}`}
                  className='group flex cursor-pointer items-center gap-1.5 no-underline'>
                  <Store size={16} className='text-sky-700' />
                  <span className='text-[12px] font-bold uppercase tracking-tight text-slate-800 transition-colors group-hover:text-sky-600 md:text-[13px]'>
                    {order.shopName}
                  </span>
                  <ChevronRight size={14} className='text-gray-400 group-hover:text-sky-600' />
                </a>
              </div>

              <div className='flex items-center gap-1.5'>
                <div
                  className={
                    order.status === 'delivered'
                      ? 'text-emerald-600'
                      : order.status === 'cancelled'
                        ? 'text-rose-500'
                        : 'text-orange-500'
                  }>
                  {order.status === 'delivered' ? (
                    <Check size={14} />
                  ) : order.status === 'cancelled' ? (
                    <X size={14} />
                  ) : (
                    <Truck size={14} />
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide md:text-[11px] ${
                    order.status === 'delivered'
                      ? 'text-emerald-600'
                      : order.status === 'cancelled'
                        ? 'text-rose-500'
                        : 'text-orange-500'
                  }`}>
                  {order.statusText}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className='divide-y divide-gray-100 px-4 md:px-6'>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className='flex cursor-pointer gap-3 py-4 transition-colors hover:bg-slate-50/50 md:gap-4 md:py-5'>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover md:h-20 md:w-20'
                  />
                  <div className='flex flex-1 flex-col justify-between overflow-hidden'>
                    <div className='space-y-1'>
                      <h3 className='line-clamp-2 text-sm font-medium leading-tight text-slate-800 md:line-clamp-1 md:text-[15px]'>
                        {item.name}
                      </h3>
                      <p className='text-xs text-slate-500 md:font-medium md:text-gray-700'>x{item.quantity}</p>
                    </div>
                    <div className='flex items-center justify-end gap-2 text-right'>
                      {item.oldPrice && (
                        <span className='text-[11px] text-gray-400 line-through md:text-[12px]'>
                          {item.oldPrice.toLocaleString()}đ
                        </span>
                      )}
                      <span className='text-sm font-semibold text-sky-700 md:text-[16px]'>
                        {item.price.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer: Summary & Actions */}
            <div className='border-t border-gray-100 bg-slate-50/30 px-4 py-4 md:px-6 md:py-5'>
              <div className='mb-4 flex items-center justify-end gap-2'>
                <div className='flex items-center gap-1 text-slate-500'>
                  <ShieldCheck size={14} className='text-sky-600' />
                  <span className='text-[11px] font-medium'>Thành tiền:</span>
                </div>
                <span className='text-base font-bold text-sky-700 md:text-lg'>
                  {order.totalPrice.toLocaleString()}đ
                </span>
              </div>

              {/* Actions Row */}
              <div className='flex flex-col gap-2 sm:flex-row sm:justify-end md:gap-3'>
                {order.status === 'pending' && (
                  <button
                    onClick={() => setCancelOrderId(order.id)}
                    className='w-full cursor-pointer rounded-lg border border-rose-200 bg-white px-6 py-2 text-xs font-bold uppercase text-rose-500 transition-all active:scale-95 sm:w-auto'>
                    Hủy đơn hàng
                  </button>
                )}

                {order.status === 'delivered' && (
                  <>
                    <button className='w-full cursor-pointer rounded-lg bg-sky-600 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-sky-800 active:scale-95 sm:w-auto'>
                      Mua Lại
                    </button>
                    <button className='w-full cursor-pointer rounded-lg border border-sky-200 bg-white px-6 py-2.5 text-xs font-bold uppercase text-sky-700 transition-all hover:bg-slate-50 active:scale-95 sm:w-auto'>
                      Đánh Giá
                    </button>
                  </>
                )}

                {(order.status === 'cancelled' || order.status === 'returned') && (
                  <button className='w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-6 py-2 text-xs font-bold uppercase text-gray-500 transition-all hover:bg-slate-50 sm:w-auto'>
                    Chi Tiết Hủy
                  </button>
                )}

                {(order.status === 'shipping' || order.status === 'preparing') && (
                  <button className='w-full cursor-pointer rounded-lg bg-sky-600 px-8 py-2.5 text-xs font-bold uppercase text-white shadow-sm transition-all hover:bg-sky-800 sm:w-auto'>
                    Theo Dõi
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL HỦY ĐƠN */}
      {cancelOrderId && (
        <div className='fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-4'>
          <div
            className='animate-in fade-in absolute inset-0 cursor-pointer bg-slate-900/40 backdrop-blur-[2px]'
            onClick={() => {
              setCancelOrderId(null);
              setCancelReason('');
            }}></div>
          <div className='animate-in slide-in-from-bottom sm:zoom-in-95 relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl duration-300 sm:rounded-2xl'>
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
              <h2 className='text-base font-bold text-slate-800'>Lý do hủy đơn hàng</h2>
              <button
                onClick={() => setCancelOrderId(null)}
                className='cursor-pointer p-1 text-slate-400 hover:text-slate-600'>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className='max-h-[60vh] space-y-4 overflow-y-auto p-6'>
              <div className='rounded-lg border border-amber-100 bg-amber-50 p-3'>
                <p className='text-[11px] italic leading-relaxed text-amber-700'>
                  Lưu ý: Bạn chỉ có thể hủy đơn hàng 01 lần duy nhất. Thao tác này không thể hoàn tác.
                </p>
              </div>

              <div className='flex flex-col gap-1'>
                {CANCEL_REASONS.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                      cancelReason === reason ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:bg-slate-50'
                    }`}>
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                        cancelReason === reason ? 'border-sky-600 bg-sky-600' : 'border-slate-300'
                      }`}>
                      {cancelReason === reason && <div className='h-1.5 w-1.5 rounded-full bg-white'></div>}
                    </div>
                    <input
                      type='radio'
                      name='cancel_reason'
                      className='hidden'
                      value={reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span
                      className={`text-sm ${cancelReason === reason ? 'font-semibold text-sky-800' : 'text-slate-600'}`}>
                      {reason}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex gap-3 border-t border-slate-50 p-6'>
              <button
                onClick={() => setCancelOrderId(null)}
                className='flex-1 cursor-pointer rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 active:scale-95'>
                Quay lại
              </button>
              <button
                disabled={!cancelReason}
                className='flex-1 cursor-pointer rounded-xl bg-rose-500 py-3 text-sm font-bold uppercase text-white shadow-md transition-all active:scale-95 disabled:opacity-50'>
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
