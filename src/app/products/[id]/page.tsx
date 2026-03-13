import { notFound } from "next/navigation";
import Breadcrumb from "src/components/Breadcrumbs";
import RelatedProducts from "src/components/RelatedProducts";
import AddToCartWithQty from "src/components/ui/AddToCart";
import ProductFeedback from "src/components/ProductFeedback";
import ProductImageGallery from "src/components/ProductImageGallery";
import { FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  image: string;
  galleryImages: string[];
  price: number;
  oldPrice?: number;
  rating?: number;
  stock: number;
  status: string;
  description?: string;
}

async function getProduct(id: string): Promise<Product> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/products/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) return notFound();

    const product = await res.json();

    if (!product.galleryImages || product.galleryImages.length === 0) {
      product.galleryImages = [
        product.image,
        "https://placehold.co/600x600/e2e8f0/111?text=Product",
        "https://placehold.co/600x600/e2e8f0/111?text=Gallery",
      ];
    }

    return product;
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const product = await getProduct(id);

    return {
      title: product.name,
      description:
        product.description ||
        "Sản phẩm chính hãng với giá tốt nhất.",
    };
  } catch {
    return {
      title: "Sản phẩm",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  const discountPercent =
    product.oldPrice &&
    Math.round(
      ((product.oldPrice - product.price) / product.oldPrice) * 100
    );

  return (
    <main className="min-h-screen bg-[#f5f5fa] pb-12">
      <div className="mx-auto max-w-[1200px] px-4 pt-4">

        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/products" },
              { label: product.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_350px]">

          {/* LEFT */}
          <div className="flex flex-col gap-4">

            <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[420px_1fr]">

              {/* IMAGE */}
              <ProductImageGallery
                images={product.galleryImages}
                alt={product.name}
              />

              {/* INFO */}
              <div className="flex flex-col">

                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Chính hãng
                  </span>

                  {discountPercent && (
                    <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <h1 className="mb-3 text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>

                {/* rating */}
                <div className="mb-6 flex items-center gap-3 text-sm">

                  <span className="font-semibold text-yellow-500">
                    {product.rating?.toFixed(1) ?? "4.8"} ★
                  </span>

                  <div className="h-3 w-px bg-gray-200" />

                  <span className="text-gray-400">
                    Đã bán 1.2k
                  </span>

                  <div className="h-3 w-px bg-gray-200" />

                  <span
                    className={`font-medium ${
                      product.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {product.stock > 0
                      ? `Còn ${product.stock} sản phẩm`
                      : "Hết hàng"}
                  </span>

                </div>

                {/* price */}
                <div className="mb-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">

                  <span className="text-2xl font-bold text-red-600">
                    {product.price.toLocaleString()}₫
                  </span>

                  {product.oldPrice && (
                    <span className="text-gray-400 line-through">
                      {product.oldPrice.toLocaleString()}₫
                    </span>
                  )}

                </div>

                {/* description */}
                <div className="mb-8 text-sm leading-relaxed text-gray-600">
                  <h3 className="mb-2 font-semibold text-gray-800">
                    Mô tả:
                  </h3>

                  {product.description ||
                    "Sản phẩm chính hãng, chất lượng đảm bảo."}
                </div>

                <AddToCartWithQty product={product} />

              </div>
            </div>

            {/* FEEDBACK */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <ProductFeedback productId={id} />
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <h3 className="mb-4 font-bold text-gray-800">
                An tâm mua sắm
              </h3>

              <ul className="space-y-4 text-sm">

                <li className="flex gap-3">
                  <FaShieldAlt className="text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold">
                      Bảo hành chính hãng
                    </p>
                    <p className="text-gray-500">
                      Đổi mới trong 30 ngày
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <FaTruck className="text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold">
                      Giao hàng nhanh
                    </p>
                    <p className="text-gray-500">
                      Nhận trong 2-3 ngày
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <FaUndo className="text-orange-500 mt-1" />
                  <div>
                    <p className="font-semibold">
                      Đổi trả dễ dàng
                    </p>
                    <p className="text-gray-500">
                      Hoàn tiền nếu không hài lòng
                    </p>
                  </div>
                </li>

              </ul>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">
                Sản phẩm tương tự
              </h2>

              <RelatedProducts currentId={id} />
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}