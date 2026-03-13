'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from 'src/store/cart_actions';
import Image from 'next/image';
import {
  FaMapMarkerAlt,
  FaChevronLeft,
  FaExclamationTriangle,
  FaTicketAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';

interface Address {
  id: number;
  name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const cart = useCartStore((s) => s.cart);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountValue: number;
  } | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.id) return;

      setIsAddressLoading(true);

      try {
        const res = await fetch(`/api/user/address?userId=${user.id}`);

        if (res.ok) {
          const data: Address[] = await res.json();
          setAddresses(data);

          const defaultAddr = data.find((a) => a.isDefault) || data[0] || null;
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error('Lỗi lấy địa chỉ:', err);
      } finally {
        setIsAddressLoading(false);
      }
    };

    fetchAddresses();
  }, [user?.id]);

  const selectedProducts = useMemo(() => {
    const itemsParam = searchParams.get("items");

    let ids: number[] = [];

    try {
      const parsed = itemsParam ? JSON.parse(itemsParam) : [];

      if (Array.isArray(parsed)) {
        ids = parsed.map((id) => Number(id));
      }
    } catch {
      ids = [];
    }

    const idSet = new Set<number>(ids);

    return cart.filter((item) => idSet.has(Number(item.id)));
  }, [searchParams, cart]);

  const subTotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = subTotal > 0 ? 30000 : 0;

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === "SAVE20") {
      if (subTotal >= 200000) {
        setAppliedVoucher({ code: "SAVE20", discountValue: 20000 });
      } else {
        alert("Đơn hàng chưa đủ 200K để áp dụng mã này.");
      }
    } else if (voucherCode.toUpperCase() === "SHIP0") {
      setAppliedVoucher({ code: "SHIP0", discountValue: shippingFee });
    } else {
      alert("Mã không hợp lệ.");
    }
  };

  const total = subTotal + shippingFee - (appliedVoucher?.discountValue || 0);

  if (authLoading || isAddressLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f5fa]">
        <FaSpinner className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5fa] py-8">
      <div className="mx-auto max-w-[1200px] px-4">

        <Link
          href="/cart"
          className="mb-4 inline-flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-medium"
        >
          <FaChevronLeft size={10} /> Quay lại giỏ hàng
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">

  <div className="space-y-6">

    {/* ADDRESS */}
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <div className="flex items-center gap-2 mb-4">
        <FaMapMarkerAlt className="text-red-500" />
        <h2 className="font-bold text-lg">Địa chỉ giao hàng</h2>
      </div>

      {selectedAddress ? (
        <div className="flex justify-between items-start">

          <div>
            <p className="font-semibold">
              {selectedAddress.name} | {selectedAddress.phone}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {selectedAddress.street}, {selectedAddress.ward},{" "}
              {selectedAddress.district}, {selectedAddress.city}
            </p>
          </div>

          <Link
            href="/account/address"
            className="text-blue-600 text-sm hover:underline"
          >
            Thay đổi
          </Link>

        </div>
      ) : (
        <div className="flex items-center gap-2 text-yellow-600 text-sm">
          <FaExclamationTriangle />
          Bạn chưa có địa chỉ giao hàng.
        </div>
      )}

    </div>

          {/* PRODUCTS */}
          <div className="rounded-xl bg-white p-6 shadow-sm">

            {selectedProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-6">

                <div className="relative h-20 w-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {item.price.toLocaleString()}₫
                  </p>
                  <p className="text-xs">x{item.quantity}</p>
                </div>

              </div>
            ))}

          </div>
          </div>

          {/* SUMMARY */}
          <div className="rounded-xl bg-white p-6 shadow-sm h-fit">

            <h2 className="text-lg font-bold mb-4">
              Chi tiết thanh toán
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>{subTotal.toLocaleString()}₫</span>
              </div>

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString()}₫</span>
              </div>

              {appliedVoucher && (
                <div className="flex justify-between text-green-600">
                  <span>Voucher</span>
                  <span>-{appliedVoucher.discountValue.toLocaleString()}₫</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Tổng</span>
                <span className="text-[#ee4d2d]">
                  {total.toLocaleString()}₫
                </span>
              </div>

            </div>

            <button
              className="mt-6 w-full py-3 rounded-lg bg-[#ee4d2d] text-white font-bold hover:bg-[#d73211]"
              disabled={!selectedAddress || selectedProducts.length === 0}
              onClick={() =>
                alert(`Đặt hàng thành công!\nTổng: ${total.toLocaleString()}₫`)
              }
            >
              ĐẶT HÀNG
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}