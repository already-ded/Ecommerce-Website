import Link from "next/image";
import Image from "next/image";
import LinkNext from "next/link";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  rating?: number;
  category: string;
}

async function getRelatedProducts(currentId: string): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const products: Product[] = await res.json();

  // Lọc bỏ sản phẩm hiện tại và lấy 5 sản phẩm liên quan
  return products
    .filter(p => p.id !== currentId)
    .slice(0, 6);
}

export default async function RelatedProducts({
  currentId,
}: {
  currentId: string;
}) {
  const products = await getRelatedProducts(currentId);

  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <LinkNext
          key={product.id}
          href={`/products/${product.id}`}
          className="group flex gap-3 p-2 bg-white rounded-xl border border-transparent hover:border-blue-100 hover:shadow-md transition-all duration-300"
        >
          {/* Ảnh nhỏ bên trái */}
          <div className="relative w-20 h-20 shrink-0 bg-[#f8f8f8] rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="80px"
              className="object-contain p-2 transition duration-300 group-hover:scale-110"
            />
          </div>

          {/* Nội dung bên phải */}
          <div className="flex flex-col justify-center flex-1 overflow-hidden">
            <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors leading-snug">
              {product.name}
            </h3>
            
            <div className="flex flex-col">
              <span className="text-red-600 font-bold text-[15px]">
                {product.price.toLocaleString()}₫
              </span>
              {product.oldPrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  {product.oldPrice.toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Rating sao nhỏ */}
            <div className="flex items-center text-[10px] text-yellow-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < (product.rating || 5) ? "★" : "☆"}</span>
              ))}
            </div>
          </div>
        </LinkNext>
      ))}
      
      <LinkNext 
        href="/products" 
        className="text-center text-sm text-blue-600 font-semibold py-2 mt-2 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors"
      >
        Xem thêm tất cả
      </LinkNext>
    </div>
  );
}