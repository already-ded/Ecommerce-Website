"use client";

import { useEffect, useState } from "react";
import ProductList from "src/components/ProductList";
import VoucherList from "src/components/VoucherList";

export default function SalePage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(res => setData(res));
  }, []);

  return (
    <main className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-start px-4 py-8">
    <section className="w-full max-w-[1120px]">
        <h3 className="text-2xl font-bold text-center mb-6">HOT COUPON!!!</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <VoucherList
          vouchers={[
            {
              id: "1",
              title: "Giảm 20K cho đơn từ 200K",
              code: "SAVE20",
              discount: "20K",
              type: "KH mới",
              expiresAt: "2025-12-30",
              minOrder: 200000,
              onApply: (code) => navigator.clipboard.writeText(code),
            },
            {
              id: "2",
              title: "Freeship toàn quốc",
              code: "SHIP0",
              discount: "Freeship",
              type: "KH mới",
              expiresAt: "2025-12-30",
              onApply: (code) => alert(`Áp dụng mã: ${code}`),
            },
          ]}
        />
        </div>
      </section>

      <section className="w-full max-w-[1120px] mt-8">
        <h3 className="text-2xl font-bold text-center mb-6">SĂN DEAL SẬP SÀN</h3>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          <ProductList products={data} />
        </div>
      </section>
    </main>
  );
}