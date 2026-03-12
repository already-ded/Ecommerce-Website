"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "src/store/cart_actions";

export default function AddToCartWithQty({ product }: { product: any }) {

  const router = useRouter();
  const add = useCartStore(s => s.onAddToCart);
  const [qty, setQty] = useState(1);

  const increase = () => setQty(v => v + 1);
  const decrease = () => setQty(v => Math.max(1, v - 1));

  const onAdd = () => {
    for (let i = 0; i < qty; i++) add(product);
    setQty(1);
  };

  const onBuyNow = () => {

    const selected = [
      {
        id: product.id,
        quantity: qty,
      }
    ];

    router.push(
      "/checkout?items=" + encodeURIComponent(JSON.stringify(selected))
    );
  };

  return (
    <div>

      <div className="flex items-center">
        <span className="text-base mr-5 whitespace-nowrap">Số lượng</span>

        <button onClick={decrease} className="px-3 py-1.5 border border-gray-300 bg-gray-50 hover:bg-gray-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">–</button>

        <span className="px-3 py-1.5 border border-gray-300">{qty}</span>

        <button onClick={increase} className="px-3 py-1.5 border border-gray-300 bg-gray-50 hover:bg-gray-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">+</button>
      </div>

    <div className="flex gap-3 mt-4">
      <button className="w-1/2 mt-3.5 py-3 bg-sky-500 text-white font-semibold rounded-md border-0 cursor-pointer transition-[background,transform] duration-200 hover:bg-sky-700 active:transform-[scale(0.98)]" onClick={onAdd}>
        Thêm vào giỏ hàng
      </button>
      </div>

    </div>
  );
}
