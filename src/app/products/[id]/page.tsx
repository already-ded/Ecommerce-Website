import { notFound } from "next/navigation";
import Breadcrumb from "src/components/Breadcrumbs";
import RelatedProducts from "src/components/RelatedProducts";
import AddToCartWithQty from "src/components/ui/AddToCart";
import ProductFeedback from "src/components/ProductFeedback";
import ProductImageGallery from "src/components/ProductImageGallery";
import { FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";

export const dynamic = "force-dynamic";

// Định nghĩa Interface chuẩn khớp với MongoDB Schema
interface Product {
  id: string;
  _id?: string; // Thêm trường này vì MongoDB trả về _id
  name: string;
  image: string;
  galleryImages: string[];
  price: number;
  oldPrice?: number | null;
  rating?: number;
  stock: number;
  status: string;
  description?: string;
  category: string;
}

async function getProduct(id: string): Promise<Product> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products/${id}`, { 
      cache: "no-store" 
    });

    if (!res.ok) return notFound();

    const product = await res.json();

    // Mapping: Đảm bảo luôn có id (string) từ _id của MongoDB
    const formattedProduct = {
      ...product,
      id: product._id ? product._id.toString() : product.id,
      galleryImages: product.galleryImages?.length > 0 
        ? product.galleryImages 
        : [product.image, "https://placehold.co/600x600/e2e8f0/111?text=No+Image"]
    };

    return formattedProduct;
  } catch (error) {
    console.error("Fetch product error:", error);
    return notFound();
  }
}

// 2. Metadata (SEO)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.name} | Tibiki`,
      description: product.description || "Sản phẩm chính hãng giá tốt.",
    };
  } catch {
    return { title: "Sản phẩm không tồn tại" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  // Tính % giảm giá
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <main className="min-h-screen bg-[#f5f5fa] pb-12 font-sans">
      <div className="mx-auto max-w-[1200px] px-4 pt-4">
        
        {/* Breadcrumb động theo Category từ DB */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: product.category || "Sản phẩm", href: `/search?category=${product.category}` },
              { label: product.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_350px]">
          
          {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[420px_1fr]">
              
              {/* GALLERY */}
              <div className="relative">
                <ProductImageGallery images={product.galleryImages} alt={product.name} />
              </div>

              {/* THÔNG TIN CHI TIẾT */}
              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase text-white">
                    Chính hãng
                  </span>
                  {discountPercent && (
                    <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold text-white">
                      TIẾT KIỆM {discountPercent}%
                    </span>
                  )}
                </div>

                <h1 className="mb-3 text-2xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="mb-6 flex items-center gap-3 text-sm border-b border-gray-100 pb-4">
                  <span className="flex items-center gap-1 font-bold text-yellow-500">
                    {product.rating?.toFixed(1) || "5.0"} <span className="text-xs">★</span>
                  </span>
                  <div className="h-3 w-px bg-gray-300" />
                  <span className="text-gray-500">Đã bán 1.2k+</span>
                  <div className="h-3 w-px bg-gray-300" />
                  <span className={`font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                    {product.stock > 0 ? `Còn ${product.stock} trong kho` : "Tạm hết hàng"}
                  </span>
                </div>

                {/* Price Section */}
                <div className="mb-6 rounded-2xl bg-gray-50 p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-red-600">
                      {product.price.toLocaleString()}₫
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-gray-400 line-through decoration-1">
                        {product.oldPrice.toLocaleString()}₫
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-gray-400 uppercase font-medium">Giá đã bao gồm VAT</p>
                </div>

                {/* Mô tả ngắn */}
                <div className="mb-8">
                  <h3 className="mb-2 text-sm font-bold text-gray-800 uppercase tracking-wide">Đặc điểm nổi bật</h3>
                  <p className="text-sm leading-relaxed text-gray-600 bg-blue-50/30 p-4 rounded-xl border border-blue-50">
                    {product.description || "Sản phẩm đang được cập nhật mô tả chi tiết từ nhà sản xuất."}
                  </p>
                </div>

                {/* Nút mua hàng */}
                <AddToCartWithQty product={product} />
              </div>
            </div>

            {/* ĐÁNH GIÁ (FEEDBACK) */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-gray-800">Khách hàng đánh giá</h2>
              <ProductFeedback productId={id} />
            </div>
          </div>

          {/* CỘT PHẢI: WIDGETS */}
          <div className="flex flex-col gap-4">
            {/* Cam kết */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-50">
              <h3 className="mb-5 font-bold text-gray-900 border-b pb-3 text-sm uppercase">Quyền lợi khách hàng</h3>
              <ul className="space-y-5">
                {[
                  { icon: <FaShieldAlt className="text-blue-600" />, title: "Bảo hành tận tâm", desc: "Lỗi 1 đổi 1 trong 30 ngày" },
                  { icon: <FaTruck className="text-green-600" />, title: "Vận chuyển siêu tốc", desc: "Giao nhanh nội thành 2h" },
                  { icon: <FaUndo className="text-orange-500" />, title: "Đổi trả linh hoạt", desc: "Hoàn tiền nếu không ưng ý" }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="mt-1 text-xl">{item.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gợi ý sản phẩm cùng danh mục */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-sm font-bold uppercase text-gray-800 tracking-tight">Sản phẩm liên quan</h2>
              <RelatedProducts currentId={id} category={product.category} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}