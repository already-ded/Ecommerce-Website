'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { FaSpinner, FaArrowRight, FaTrashAlt } from 'react-icons/fa';
import { useCartStore } from 'src/store/cart_actions';
import { useRouter } from 'next/navigation';

const GRID_LAYOUT = 'grid grid-cols-[50px_1fr_150px_150px_150px_100px] items-center gap-4';

function EmptyCart() {
  useEffect(() => {
    document.title = 'Giỏ hàng';
  }, []);

  return (
    <main className='min-h-screen px-4 py-5'>
      <div className='flex justify-center'>
        <div className='text-center'>
          <Image
            src='/empty-cart.png'
            alt='Giỏ hàng trống'
            width={150}
            height={150}
            className='md:h-[200px] md:w-[200px]'
          />
          <div className='mt-4'>
            <p className='mb-2 text-sm md:text-base'>Giỏ hàng của bạn đang trống</p>
            <Link
              href='/'
              className='inline-flex items-center gap-2 text-sm font-semibold text-[#d70018] hover:underline md:text-base'>
              <FaArrowRight className='mui-ten' /> Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function NotLoggedInCart() {
  return (
    <div className='flex justify-center px-4 py-10'>
      <div className='text-center'>
        <Image
          src='/empty-cart.png'
          alt='Giỏ hàng trống'
          width={150}
          height={150}
          className='mx-auto md:h-[200px] md:w-[200px]'
        />
        <div className='mt-4'>
          <p className='mb-2 text-sm md:text-base'>
            Vui lòng{' '}
            <Link href='/auth/signin' className='font-semibold text-[#d70018] hover:underline'>
              đăng nhập
            </Link>{' '}
            để xem giỏ hàng
          </p>
          <span className='text-sm md:text-base'>
            Chưa có tài khoản?{' '}
            <Link href='/auth/signup' className='font-semibold text-[#d70018] hover:underline'>
              Đăng ký ngay
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

function HasCart() {
  const { increase, decrease, remove } = useCartStore();
  const cart = useCartStore((s) => s.cart);
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleItem = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
    } else {
      setSelected(cart.map((item) => item.id));
    }
  };

  const selectedTotal = cart
    .filter((item) => selected.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className='flex min-h-screen justify-center bg-[#f5f5fa] py-8'>
      <div className='w-full max-w-[1200px] px-4'>
        <div className='rounded-xl bg-white p-6 shadow-sm'>
          <h2 className='mb-6 text-xl font-bold text-gray-800'>Giỏ hàng của bạn</h2>

          {/* Header - Sử dụng GRID_LAYOUT */}
          <div
            className={`${GRID_LAYOUT} border-b border-gray-200 pb-4 text-sm font-semibold uppercase tracking-wider text-gray-500`}>
            <div className='flex justify-center'>
              <input
                type='checkbox'
                checked={selected.length === cart.length && cart.length > 0}
                onChange={toggleAll}
                className='h-5 w-5 cursor-pointer'
              />
            </div>
            <div className='ml-4 text-left'>Sản phẩm</div>
            <div className='text-center'>Đơn giá</div>
            <div className='text-center'>Số lượng</div>
            <div className='text-center'>Số tiền</div>
            <div className='text-center'>Thao tác</div>
          </div>

          {/* Items List */}
          <div className='divide-y divide-gray-100'>
            {cart.map((item) => (
              <div className={`${GRID_LAYOUT} py-5 transition-colors hover:bg-gray-50`} key={item.id}>
                {/* Checkbox */}
                <div className='flex justify-center'>
                  <input
                    type='checkbox'
                    checked={selected.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className='h-5 w-5 cursor-pointer'
                  />
                </div>

                {/* Sản phẩm */}
                <div className='flex items-center gap-4'>
                  <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-md'>
                    <Image src={item.image} alt={item.name} fill className='object-contain p-1' />
                  </div>
                  <Link href={`/products/${item.id}`} className='transition-colors hover:text-red-600'>
                    <h3 className='line-clamp-2 font-medium'>{item.name}</h3>
                  </Link>
                </div>

                {/* Đơn giá */}
                <div className='text-center font-medium text-gray-700'>{item.price.toLocaleString()}₫</div>

                {/* Số lượng */}
                <div className='flex justify-center'>
                  <div className='flex items-center overflow-hidden rounded-md border border-gray-300'>
                    <button
                      onClick={() => decrease(item.id)}
                      className='border-r border-gray-300 bg-gray-50 px-3 py-1 text-lg transition-colors hover:bg-gray-200'>
                      –
                    </button>
                    <span className='bg-white px-4 py-1 text-sm font-semibold'>{item.quantity}</span>
                    <button
                      onClick={() => increase(item.id)}
                      className='border-l border-gray-300 bg-gray-50 px-3 py-1 text-lg transition-colors hover:bg-gray-200'>
                      +
                    </button>
                  </div>
                </div>

                {/* Tổng tiền item */}
                <div className='text-center font-bold text-red-600'>
                  {(item.quantity * item.price).toLocaleString()}₫
                </div>

                {/* Thao tác */}
                <div className='flex justify-center'>
                  <button
                    onClick={() => remove(item.id)}
                    className='p-2 text-gray-400 transition-colors hover:text-red-600'
                    title='Xóa sản phẩm'>
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Thanh toán */}
          <div className='mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 md:flex-row'>
            <div className='text-lg'>
              Tổng cộng ({selected.length} sản phẩm):
              <span className='ml-2 text-2xl font-bold text-red-600'>{selectedTotal.toLocaleString()}₫</span>
            </div>
            <button
              className='w-full cursor-pointer rounded-lg bg-red-600 px-10 py-3 text-lg font-bold text-white shadow-md transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto'
              disabled={selected.length === 0}
              onClick={() => router.push('/checkout?items=' + JSON.stringify(selected))}>
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const cart = useCartStore((s) => s.cart);

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-10'>
        <FaSpinner className='h-8 w-8 animate-spin md:h-10 md:w-10' />
        <p className='mt-2 text-sm md:text-base'>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (!isLoggedIn) return <NotLoggedInCart />;
  if (cart.length === 0) return <EmptyCart />;

  return <HasCart />;
}
