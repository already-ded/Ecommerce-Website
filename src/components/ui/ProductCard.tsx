'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from  "src/store/cart_actions";
import { ShoppingCart, Check, Star } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  category: string;
  compact?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  rating = 5,
  category, // Nhận prop category
  compact = false,
}) => {
  const onAddToCart = useCartStore((state) => state.onAddToCart);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const discountPercent = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onAddToCart({ id, name, image, price });

    // Animation sequence
    setIsAnimating(true);
    setTimeout(() => {
      setIsAdded(true);
      setIsAnimating(false);
    }, 400);

    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  return (
    <div className='group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]'>
      <Link href={`/products/${id}`} className='block flex-1 text-inherit no-underline'>
        {/* Phần hình ảnh */}
        <div className='relative aspect-square w-full overflow-hidden bg-slate-50'>
          {discountPercent && (
            <span className='absolute left-2 top-2 z-10 rounded-lg bg-rose-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm md:text-xs'>
              -{discountPercent}%
            </span>
          )}

          <Image src={image} alt={name} fill className='object-contain p-2 transition duration-500' />
        </div>

        {/* Phần nội dung */}
        <div className={`flex flex-col gap-1.5 p-3 ${compact ? 'gap-1 p-2' : ''}`}>
          <p
            className={`line-clamp-2 min-h-10 overflow-hidden leading-tight text-slate-800 transition-colors group-hover:text-sky-600 ${compact ? 'text-[12px] font-medium' : 'text-[15px] font-semibold'}`}>
            {name}
          </p>

          {/* Rating & Đã bán */}
          <div className='flex items-center gap-1'>
            <div className='flex text-amber-400'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={compact ? 10 : 12}
                  fill={i < rating ? 'currentColor' : 'none'}
                  className={i < rating ? 'text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className='ml-1 text-[10px] font-medium text-slate-400'>(Đã bán 1k+)</span>
          </div>

          {/* Giá tiền và Ký hiệu giỏ hàng */}
          <div className='mt-2 flex items-center justify-between'>
            <div className='flex flex-wrap items-baseline gap-1.5'>
              <span className={`${compact ? 'text-sm' : 'text-base md:text-lg'} font-bold text-rose-600`}>
                {price.toLocaleString()}₫
              </span>
              {oldPrice && (
                <span className='text-[10px] font-normal text-slate-300 line-through md:text-[11px]'>
                  {oldPrice.toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Nút thêm vào giỏ hàng với hiệu ứng mới */}
            <button
              onClick={handleAddToCart}
              className={`relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-none shadow-sm transition-all duration-300 md:h-9 md:w-9
                ${
                  isAdded
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'bg-sky-50 text-sky-500 shadow-sky-100 hover:bg-sky-500 hover:text-white hover:shadow-md hover:shadow-sky-200'
                }
                ${isAnimating ? 'scale-90' : 'scale-100'}
              `}
              title='Thêm vào giỏ hàng'>
              {/* Ripple effect */}
              {isAnimating && <span className='absolute inset-0 animate-ping rounded-lg bg-sky-400 opacity-75'></span>}

              {/* Icon transition */}
              <span className='relative z-10'>
                {isAdded ? (
                  <Check size={18} strokeWidth={3} className='animate-in zoom-in-75 spin-in-12 duration-500' />
                ) : (
                  <ShoppingCart
                    size={16}
                    className='transition-transform group-hover:scale-110 md:h-[18px] md:w-[18px]'
                  />
                )}
              </span>

              {/* Success particles */}
              {isAdded && (
                <>
                  <span className='absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-300'></span>
                  <span
                    className='absolute -bottom-1 -left-1 h-1.5 w-1.5 animate-ping rounded-full bg-emerald-300'
                    style={{ animationDelay: '0.1s' }}></span>
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Toast notification */}
      {isAdded && (
        <div className='animate-in slide-in-from-top-2 fade-in absolute right-2 top-2 z-20 duration-300'>
          <div className='flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 shadow-lg'>
            <Check size={14} className='text-white' strokeWidth={3} />
            <span className='whitespace-nowrap text-xs font-semibold text-white'>Đã thêm vào giỏ</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
