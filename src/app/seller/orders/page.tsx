'use client';

import React, { useState } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarker,
  FaUser,
  FaStickyNote,
  FaBox,
  FaPhone,
} from 'react-icons/fa';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  district: string;
  ward: string;
  addressDetail: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  note?: string;
  items: OrderItem[];
}

const mockOrders: Order[] = [
  {
    id: 'ORD-8821',
    receiverName: 'Nguyễn Văn A',
    receiverPhone: '0901234567',
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    addressDetail: '123 Lê Lợi',
    date: '20/12/2024',
    total: 450000,
    status: 'pending',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    note: 'Giao hàng giờ hành chính giúp mình.',
    items: [{ name: 'Áo Thun Polo Nam', quantity: 2, price: 225000 }],
  },
  {
    id: 'ORD-8822',
    receiverName: 'Lê Thị B',
    receiverPhone: '0987654321',
    province: 'Đà Nẵng',
    district: 'Quận Hải Châu',
    ward: 'Phường Thạch Thang',
    addressDetail: '456 Bạch Đằng',
    date: '21/12/2024',
    total: 1200000,
    status: 'processing',
    paymentMethod: 'Chuyển khoản ngân hàng',
    items: [{ name: 'Giày Sneaker Thời Trang', quantity: 1, price: 1200000 }],
  },
];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const ordersPerPage = 5;

  const filteredByStatus = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab);
  const finalFilteredOrders = filteredByStatus.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.receiverName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(finalFilteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const displayedOrders = finalFilteredOrders.slice(startIndex, startIndex + ordersPerPage);

  const formatPrice = (price: number) => price?.toLocaleString('vi-VN') + ' VNĐ';

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700' };
      case 'processing':
        return { label: 'Chờ lấy hàng', color: 'bg-blue-100 text-blue-700' };
      case 'shipped':
        return { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-700' };
      case 'delivered':
        return { label: 'Đã giao', color: 'bg-emerald-100 text-emerald-800' };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Không xác định', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const updated = { ...o, status: newStatus };
          if (selectedOrder && selectedOrder.id === id) setSelectedOrder(updated);
          return updated;
        }
        return o;
      }),
    );
  };

  return (
    <div className='animate-in fade-in space-y-4 p-4 font-sans text-black duration-500 md:space-y-6 md:p-0'>
      {/* Header */}
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='mb-2 border-b border-gray-200 pb-2 text-xl font-bold uppercase tracking-tight text-gray-800 md:text-2xl'>
            Quản lý Đơn hàng
          </h1>
          <p className='text-xs font-medium text-gray-500 md:text-sm'>
            Theo dõi thông tin vận chuyển và thanh toán chi tiết.
          </p>
        </div>
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className='scrollbar-hide flex gap-2 overflow-x-auto border-b border-gray-200 pb-0'>
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-xs font-bold transition-all md:px-4 md:py-3 md:text-sm ${
              activeTab === tab ? 'border-sky-900 text-sky-800' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            {tab === 'all' ? 'Tất cả' : getStatusInfo(tab as any).label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className='rounded-xl border border-gray-200 bg-white p-3 shadow-sm md:p-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Tìm theo Mã đơn hoặc Tên khách...'
            className='w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-black transition-all focus:border-sky-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400'>
            <FaSearch />
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className='hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b border-gray-300 bg-gray-50'>
                <th className='px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-gray-500'>
                  Mã Đơn
                </th>
                <th className='px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-gray-500'>
                  Người Nhận
                </th>
                <th className='px-6 py-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-gray-500'>
                  Ngày Đặt
                </th>
                <th className='px-6 py-4 text-center text-[0.7rem] font-bold uppercase tracking-widest text-gray-500'>
                  Trạng Thái
                </th>
                <th className='px-6 py-4 text-right text-[0.7rem] font-bold uppercase tracking-widest text-gray-500'>
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className='py-12 text-center font-medium text-gray-400'>
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => (
                  <tr key={order.id} className='transition-colors hover:bg-gray-50/50'>
                    <td className='px-6 py-4 text-sm font-bold text-blue-800'>{order.id}</td>
                    <td className='px-6 py-4 text-sm font-semibold text-gray-700'>{order.receiverName}</td>
                    <td className='px-6 py-4 text-sm font-medium text-gray-500'>{order.date}</td>
                    <td className='px-6 py-4 text-center'>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tight ${getStatusInfo(order.status).color}`}>
                        {getStatusInfo(order.status).label}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className='cursor-pointer rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-600'>
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card View - Mobile */}
      <div className='space-y-3 md:hidden'>
        {displayedOrders.length === 0 ? (
          <div className='rounded-xl border border-gray-200 bg-white p-8 text-center font-medium text-gray-400'>
            Không tìm thấy đơn hàng nào.
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div key={order.id} className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
              {/* Header */}
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <div className='mb-1 text-sm font-bold text-blue-800'>{order.id}</div>
                  <div className='text-xs text-gray-500'>{order.date}</div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusInfo(order.status).color}`}>
                  {getStatusInfo(order.status).label}
                </span>
              </div>

              {/* Customer Info */}
              <div className='space-y-2 border-b border-t border-gray-100 py-3'>
                <div className='flex items-center gap-2'>
                  <FaUser className='text-xs text-gray-400' />
                  <span className='text-sm font-semibold text-gray-700'>{order.receiverName}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <FaPhone className='text-xs text-gray-400' />
                  <span className='text-sm text-gray-600'>{order.receiverPhone}</span>
                </div>
              </div>

              {/* Total and Action */}
              <div className='mt-3 flex items-center justify-between'>
                <div>
                  <div className='mb-0.5 text-xs text-gray-500'>Tổng tiền</div>
                  <div className='text-base font-bold text-blue-600'>{formatPrice(order.total)}</div>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className='cursor-pointer rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100 active:bg-blue-200'>
                  Chi tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row md:p-4'>
          <span className='font-sans text-xs font-bold uppercase tracking-widest text-gray-400'>
            Trang {currentPage} / {totalPages}
          </span>
          <div className='flex gap-2'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30'>
              <FaChevronLeft />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30'>
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Modal Chi tiết đơn hàng - Responsive */}
      {selectedOrder && (
        <div className='fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4 font-sans'>
          <div className='animate-in zoom-in-95 flex max-h-[83vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200'>
            {/* Modal Header */}
            <div className='flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 md:px-6 md:py-4'>
              <div>
                <h2 className='text-base font-bold leading-tight text-gray-900 md:text-xl'>
                  Đơn hàng {selectedOrder.id}
                </h2>
                <p className='mt-1 text-xs text-gray-500'>Đặt ngày: {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className='cursor-pointer p-2 text-gray-400 transition-colors hover:text-gray-900'>
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className='space-y-4 overflow-y-auto p-4 md:space-y-6 md:p-6'>
              {/* CẬP NHẬT TRẠNG THÁI */}
              <div className='rounded-2xl border border-blue-100 bg-blue-50/50 p-4 md:p-5'>
                <h3 className='mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 md:mb-4'>
                  <FaCheckCircle className='text-blue-600' /> Trạng thái xử lý
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleUpdateStatus(selectedOrder.id, val as any)}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedOrder.status === val
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      {getStatusInfo(val as any).label}
                    </button>
                  ))}
                </div>
              </div>

              {/* THÔNG TIN NGƯỜI NHẬN & ĐỊA CHỈ */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
                  <h3 className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400'>
                    <FaUser /> Thông tin người nhận
                  </h3>
                  <div>
                    <p className='text-sm font-bold text-gray-800'>{selectedOrder.receiverName}</p>
                    <p className='mt-1 text-sm font-medium text-gray-600'>{selectedOrder.receiverPhone}</p>
                  </div>
                  <div className='border-t border-gray-50 pt-2'>
                    <p className='mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400'>
                      Phương thức thanh toán
                    </p>
                    <p className='text-xs font-semibold text-sky-700'>{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                <div className='space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
                  <h3 className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400'>
                    <FaMapMarker /> Địa chỉ giao hàng
                  </h3>
                  <div className='text-sm font-medium leading-relaxed text-gray-700'>
                    <p>{selectedOrder.addressDetail}</p>
                    <p>
                      {selectedOrder.ward}, {selectedOrder.district}
                    </p>
                    <p>{selectedOrder.province}</p>
                  </div>
                </div>
              </div>

              {/* GHI CHÚ ĐƠN HÀNG */}
              {selectedOrder.note && (
                <div className='rounded-xl border border-amber-100 bg-amber-50/50 p-4'>
                  <h3 className='mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-amber-600'>
                    <FaStickyNote /> Ghi chú từ khách hàng
                  </h3>
                  <p className='text-sm font-medium italic leading-relaxed text-gray-700'>"{selectedOrder.note}"</p>
                </div>
              )}

              {/* DANH SÁCH SẢN PHẨM */}
              <div className='space-y-3'>
                <h3 className='text-[11px] font-bold uppercase tracking-widest text-gray-400'>Sản phẩm trong đơn</h3>

                {/* Desktop Table */}
                <div className='hidden overflow-hidden rounded-xl border border-gray-100 shadow-sm sm:block'>
                  <table className='w-full text-left text-sm'>
                    <thead className='bg-gray-50 text-[10px] font-bold uppercase text-gray-500'>
                      <tr>
                        <th className='px-4 py-2.5'>Sản phẩm</th>
                        <th className='px-4 py-2.5 text-center'>SL</th>
                        <th className='px-4 py-2.5 text-right font-medium'>Đơn giá</th>
                        <th className='px-4 py-2.5 text-right'>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className='px-4 py-3 text-xs font-bold text-gray-700'>{item.name}</td>
                          <td className='px-4 py-3 text-center font-medium text-gray-700'>{item.quantity}</td>
                          <td className='px-4 py-3 text-right font-medium text-gray-700'>{formatPrice(item.price)}</td>
                          <td className='px-4 py-3 text-right font-black text-gray-700'>
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className='space-y-2 sm:hidden'>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className='rounded-lg border border-gray-100 bg-white p-3'>
                      <div className='mb-2 flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='mb-1 text-sm font-bold text-gray-800'>{item.name}</p>
                          <p className='text-xs text-gray-500'>Số lượng: {item.quantity}</p>
                        </div>
                      </div>
                      <div className='flex items-center justify-between border-t border-gray-50 pt-2'>
                        <span className='text-xs text-gray-500'>{formatPrice(item.price)}</span>
                        <span className='text-sm font-bold text-gray-800'>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TỔNG KẾT CHI TIẾT */}
              <div className='flex flex-col items-end gap-2 border-t border-gray-100 pt-4'>
                <div className='flex w-full justify-between text-sm'>
                  <span className='font-medium text-gray-500'>Tạm tính (Tiền hàng):</span>
                  <span className='font-bold text-gray-800'>{formatPrice(selectedOrder.total)}</span>
                </div>
                <div className='flex w-full justify-between text-sm'>
                  <span className='font-medium text-gray-500'>Phí vận chuyển:</span>
                  <span className='font-bold text-emerald-600'>Miễn phí</span>
                </div>
                <div className='mt-2 flex w-full justify-between border-t border-dashed border-gray-200 pt-2 text-base font-extrabold text-gray-900 md:text-lg'>
                  <span>Tổng thanh toán:</span>
                  <span className='text-blue-500'>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex flex-col-reverse justify-end gap-3 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row'>
              <button
                onClick={() => setSelectedOrder(null)}
                className='cursor-pointer rounded-lg px-6 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-200'>
                Đóng
              </button>
              <button className='cursor-pointer rounded-lg bg-gray-800 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-black active:scale-95'>
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
