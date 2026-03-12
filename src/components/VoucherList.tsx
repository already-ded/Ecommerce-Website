"use client";

import { FC } from "react";
import VoucherCard, { VoucherCardProps } from "./ui/VoucherCard";

interface VoucherListProps {
  vouchers: VoucherCardProps[];
}

const VoucherList: FC<VoucherListProps> = ({ vouchers }) => {
  return (
    <>
      {vouchers.map((v) => (
        <VoucherCard
          key={v.id}
          id={v.id}
          title={v.title}
          code={v.code}
          discount={v.discount}
          type={v.type}
          expiresAt={v.expiresAt}
          minOrder={v.minOrder}
          onApply={v.onApply}
        />
      ))}
    </>
  );
};

export default VoucherList;
