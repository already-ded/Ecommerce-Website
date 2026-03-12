'use client';

import React from 'react';
import { Banknote, ShoppingBasket, Star, Users, AlertCircle, ArrowRight, LineChart, ChevronDown } from 'lucide-react';

export default function SellerDashboardPage() {
  return (
    <div className='animate-in fade-in space-y-6 font-sans text-slate-800 duration-500 md:space-y-8'>
      {/* Tiêu đề trang */}
      <div className='flex flex-col justify-between gap-2 md:flex-row md:items-end'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight text-black md:text-[28px]'>Tổng quan kinh doanh</h1>
          <p className='mt-0.5 text-sm font-normal italic text-slate-400'>Cập nhật lúc: 24/12/2024 - 16:58</p>
        </div>
      </div>

      {/* Các Thẻ Thống kê Chính */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4'>
        <StatCard
          title='Doanh thu hôm nay'
          value='12,450,000 đ'
          trend='+12.5%'
          icon={<Banknote size={20} />}
          color='blue'
        />
        <StatCard title='Đơn hàng mới' value='18' trend='+3 đơn' icon={<ShoppingBasket size={20} />} color='green' />
        <StatCard title='Đánh giá Shop' value='4.9 / 5' trend='98% hài lòng' icon={<Star size={20} />} color='amber' />
        <StatCard title='Lượt truy cập' value='1,204' trend='+15%' icon={<Users size={20} />} color='indigo' />
      </div>

      <div className='grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3'>
        {/* BIỂU ĐỒ HIỆU SUẤT */}
        <div className='flex h-full min-h-[350px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all md:p-7 lg:col-span-2'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h2 className='flex items-center gap-2 text-base font-semibold text-slate-700 md:text-lg'>
                <LineChart className='text-sky-500' size={18} />
                Hiệu suất doanh số
              </h2>
              <p className='text-[11px] font-medium text-slate-400'>Phân tích tăng trưởng định kỳ</p>
            </div>
            <div className='group relative'>
              <select className='cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-[11px] font-medium text-slate-500 outline-none transition-colors hover:bg-slate-100'>
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
                <option>Tháng này</option>
              </select>
              <ChevronDown
                size={12}
                className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400'
              />
            </div>
          </div>

          <div className='flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-300'>
            <LineChart size={32} className='opacity-40' />
            <span className='text-[10px] font-medium uppercase tracking-[0.15em] opacity-70'>Đang tải dữ liệu...</span>
          </div>
        </div>

        {/* KHU VỰC: VIỆC CẦN LÀM NGAY */}
        <div className='relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg md:p-7'>
          <div className='relative z-10'>
            <h2 className='mb-6 flex items-center gap-2 text-base font-semibold text-white md:text-lg'>
              <AlertCircle className='text-rose-400' size={18} />
              Cần xử lý ngay
            </h2>

            <div className='space-y-2.5 md:space-y-3'>
              <TodoItem
                label='Đơn hàng chờ xác nhận'
                count={5}
                urgency='high'
                description='Duyệt đơn sớm để giao kịp lúc'
                link='orders'
              />
              <TodoItem
                label='Đơn hàng chưa chuẩn bị'
                count={12}
                urgency='medium'
                description='Cần hoàn thành trong hôm nay'
                link='orders'
              />
              <TodoItem
                label='Sản phẩm sắp hết hàng'
                count={3}
                urgency='warning'
                description='Cập nhật tồn kho ngay'
                link='products'
              />
            </div>

            <button className='group mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-sky-500 py-3 text-[11px] font-semibold uppercase tracking-wider text-white shadow-md shadow-sky-900/20 transition-all hover:bg-sky-400 active:scale-[0.98]'>
              Xử lý tất cả đơn hàng
              <ArrowRight size={14} className='transition-transform group-hover:translate-x-1' />
            </button>
          </div>

          {/* Họa tiết trang trí */}
          <div className='absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-sky-400/5 blur-[80px]'></div>
        </div>
      </div>
    </div>
  );
}

// Component Thẻ thống kê nhỏ
const StatCard = ({ title, value, trend, icon, color }: any) => {
  const bgColors: any = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-emerald-50 text-emerald-500',
    amber: 'bg-amber-50 text-amber-500',
    indigo: 'bg-indigo-50 text-indigo-500',
  };
  return (
    <div className='group relative cursor-default overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md'>
      <div className='relative z-10 mb-3 flex items-start justify-between'>
        <div
          className={`rounded-lg p-2 ${bgColors[color]} shadow-sm transition-transform duration-500 group-hover:scale-105`}>
          {icon}
        </div>
        <span className='rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-medium tracking-tight text-slate-500'>
          {trend}
        </span>
      </div>
      <div className='relative z-10'>
        <p className='text-[10px] font-medium uppercase tracking-wider text-slate-400'>{title}</p>
        <h3 className='mt-0.5 text-xl font-semibold tracking-tight text-slate-700'>{value}</h3>
      </div>
    </div>
  );
};

// Component Mục việc cần làm
const TodoItem = ({ label, count, urgency, description, link }: any) => {
  const urgencyStyles: any = {
    high: { dot: 'bg-rose-400', shadow: 'shadow-[0_0_6px_rgba(251,113,133,0.3)]' },
    medium: { dot: 'bg-sky-400', shadow: 'shadow-[0_0_6px_rgba(56,189,248,0.3)]' },
    warning: { dot: 'bg-amber-400', shadow: 'shadow-[0_0_6px_rgba(251,191,36,0.3)]' },
  };

  const style = urgencyStyles[urgency];

  return (
    <a
      href={link}
      className='group flex cursor-pointer items-center justify-between rounded-xl border border-slate-700 bg-slate-800/30 p-3.5 no-underline transition-all hover:border-slate-500 hover:bg-slate-800/60'>
      <div className='flex items-center gap-3'>
        <div className={`h-1.5 w-1.5 rounded-full ${style.dot} ${style.shadow}`}></div>
        <div className='min-w-0'>
          <p className='truncate text-[13px] font-medium text-slate-200 transition-colors group-hover:text-white'>
            {label}
          </p>
          <p className='mt-0.5 text-[10px] font-normal text-slate-500'>{description}</p>
        </div>
      </div>
      <div className='ml-2 flex items-center gap-2.5'>
        <span className='rounded-md border border-slate-600 bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 transition-colors group-hover:bg-slate-700 group-hover:text-white'>
          {count}
        </span>
        <ArrowRight size={12} className='shrink-0 text-slate-600 transition-colors group-hover:text-slate-400' />
      </div>
    </a>
  );
};
