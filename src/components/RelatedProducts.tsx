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

// Cập nhật hàm fetch để nhận thêm category
async function getRelatedProducts(currentId: string, category: string): Promise<Product[]> {
  try {
    // Truyền category vào query params để server lọc giúp
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products?category=${encodeURIComponent(category)}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const products: Product[] = await res.json();

    // Lọc bỏ sản phẩm hiện tại và lấy 6 cái
    return products
      .filter(p => p.id !== currentId)
      .slice(0, 6);
  } catch (error) {
    console.error("Related products fetch error:", error);
    return [];
  }
}

export default async function RelatedProducts({
  currentId,
  category, // Nhận thêm prop category từ trang Detail
}: {
  currentId: string;
  category: string; // Khai báo kiểu dữ liệu ở đây để hết lỗi TS
}) {
  const products = await getRelatedProducts(currentId, category);

  if (products.length === 0) {
    return <p className="text-gray-400 text-xs italic">Không có sản phẩm liên quan nào.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <LinkNext
          key={product.id}
          href={`/products/${product.id}`}
          className="group flex gap-3 p-2 bg-white rounded-xl border border-transparent hover:border-blue-100 hover:shadow-md transition-all duration-300"
        >
          {/* Ảnh nhỏ bên trái */}
          <div className="relative w-20 h-20 shrink-0 bg-[#f8f8f8] rounded-lg overflow-hidden border border-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="80px"
              className="object-contain p-2 transition duration-500 group-hover:scale-110"
            />
          </div>

          {/* Nội dung bên phải */}
          <div className="flex flex-col justify-center flex-1 overflow-hidden">
            <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
            
            <div className="flex flex-col gap-0.5">
              <span className="text-red-600 font-bold text-[14px]">
                {product.price.toLocaleString()}₫
              </span>
              {product.oldPrice && (
                <span className="text-[10px] text-gray-400 line-through">
                  {product.oldPrice.toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Rating sao nhỏ */}
            <div className="flex items-center text-[10px] text-yellow-400 mt-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="leading-none">
                  {i < Math.floor(product.rating || 5) ? "★" : "☆"}
                </span>
              ))}
            </div>
          </div>
        </LinkNext>
      ))}
      
      <LinkNext 
        href={`/search?category=${category}`} 
        className="text-center text-[13px] text-blue-600 font-bold py-2.5 mt-2 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all active:scale-95"
      >
        Xem thêm {category}
      </LinkNext>
    </div>
  );
}