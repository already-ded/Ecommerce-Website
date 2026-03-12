"use client";
import { FC } from "react";

export interface VoucherCardProps {
  id: string;
  title: string;
  code: string;
  discount: string;
  type: string;
  expiresAt: string;
  minOrder?: number;
  onApply?: (code: string) => void;
}

const VoucherCard: FC<VoucherCardProps> = ({
  id,
  title,
  code,
  discount,
  type,
  expiresAt,
  minOrder,
  onApply
}) => {
  return (
   <div className="flex bg-white rounded-xl border hover:shadow-md transition overflow-hidden gap-2">

  {/* Logo */}
  <div className="w-28 bg-sky-600 text-white flex flex-col items-center justify-center text-center font-bold text-sm select-none">
    <span>VOUCHER</span>
    <span className="text-xs mt-1 bg-white text-sky-600 px-1 rounded">HOT</span>
  </div>

  {/* Info */}
  <div className="flex-1 text-sm px-4 py-2">
    <span className="text-xs font-semibold block mb-1">
      {type}
    </span>

    <p className="font-semibold leading-tight">{title}</p>

    <p className="text-xs text-gray-500">
      Cho đơn từ {minOrder ? minOrder.toLocaleString() + "₫" : "0₫"}
    </p>

    <p className="text-[11px] text-gray-400">
      HSD: {new Date(expiresAt).toLocaleDateString("vi-VN")}
    </p>
  </div>

  {/* Save Button */}
  <div className="flex items-center pr-4">
    <button
      onClick={() => onApply && onApply(code)}
    className="bg-sky-600 text-white text-[15px] font-semibold py-[5px] px-[15px] rounded-xl transition mr-3 mb-1 shadow-sm cursor-pointer hover:bg-sky-700"
    >
      Sử dụng
    </button>
  </div>
</div>
  );
};

export default VoucherCard;
