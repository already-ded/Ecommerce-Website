// src/app/product/[id]/page.tsx
import { notFound } from 'next/navigation';
import Breadcrumb from 'src/components/Breadcrumbs';
import RelatedProducts from 'src/components/RelatedProducts';
import AddToCartWithQty from 'src/components/ui/AddToCart';
import ProductFeedback from 'src/components/ProductFeedback';
import ProductImageGallery from 'src/components/ProductImageGallery';
import { FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa'; // Icon cho chính sách

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
  const res = await fetch(`http://localhost:3000/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) notFound();

  const productData = await res.json();
  if (!productData.galleryImages || productData.galleryImages.length === 0) {
    productData.galleryImages = [
      productData.image,
      'https://via.placeholder.com/600x600/FFD700/FFFFFF?text=Product+View+2',
      'https://via.placeholder.com/600x600/ADD8E6/FFFFFF?text=Product+View+3',
    ];
  }
  return productData;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null;

  return (
    <main className='min-h-screen bg-[#f5f5fa] pb-12'>
      <div className='mx-auto max-w-[1200px] px-4 pt-4'>
        
        {/* Breadcrumb - Đưa lên trên cùng, tách biệt */}
        <div className='mb-4 text-sm'>
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' }, 
              { label: 'Sản phẩm', href: '/products' }, 
              { label: product.name }
            ]}
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4'>
          
          {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
          <div className='flex flex-col gap-4'>
            
            {/* Khối Gallery & Thông tin cơ bản */}
            <div className='grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 rounded-2xl bg-white p-6 shadow-sm border border-white'>
              <div className='flex flex-col gap-4'>
                <ProductImageGallery images={product.galleryImages} alt={product.name} />
              </div>

              <div className='flex flex-col'>
                {/* Brand & Badge */}
                <div className='flex items-center gap-2 mb-2'>
                  <span className='bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider'>
                    Chính hãng
                  </span>
                  <span className='text-sm text-gray-500'></span>
                </div>

                <h1 className='text-[24px] font-bold text-gray-900 mb-2 leading-tight'>
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className='flex items-center gap-3 mb-6'>
                  <div className='flex items-center text-[#ffc107] font-bold text-sm'>
                    {product.rating?.toFixed(1)} <span className='ml-1 text-[16px]'>★</span>
                  </div>
                  <div className='h-3 w-px bg-gray-200' />
                  <span className='text-sm text-gray-400 italic underline'>Đã bán 1.2k</span>
                  <div className='h-3 w-px bg-gray-200' />
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>

                {/* Khối Giá tiền - Làm to và nổi bật */}
                <div className='mb-6 p-4 bg-[#fbfbfb] rounded-2xl flex items-center gap-4'>
                  <span className='text-[24px] font-bold text-red-600'>
                    {product.price.toLocaleString()}₫
                  </span>
                  {product.oldPrice && (
                    <div className='flex flex-col'>
                      <span className='text-gray-400 line-through text-[15px]'>
                        {product.oldPrice.toLocaleString()}₫
                      </span>        
                    </div>
                  )}
                </div>

                {/* Mô tả ngắn */}
                <div className='mb-8 text-[15px] text-gray-600 leading-relaxed'>
                  <h3 className='font-bold text-gray-800 mb-2'>Mô tả tóm tắt:</h3>
                  {product.description || "Sản phẩm được bảo hành chính hãng toàn quốc, cam kết chất lượng tốt nhất trong tầm giá."}
                </div>

                <div className='mt-auto'>
                  <AddToCartWithQty product={product} />
                </div>
              </div>
            </div>

            {/* Khối Đánh giá (Feedback) */}
            <div className='rounded-2xl bg-white p-6 shadow-sm border border-white'>
              <ProductFeedback productId={id} />
            </div>
          </div>

          {/* CỘT PHẢI: CHÍNH SÁCH & LIÊN QUAN */}
          <div className='flex flex-col gap-4'>
            
            {/* Cam kết bán hàng */}
            <div className='rounded-2xl bg-white p-5 shadow-sm border border-white'>
              <h3 className='font-bold text-gray-800 mb-4'>An tâm mua sắm</h3>
              <ul className='space-y-4 text-sm'>
                <li className='flex items-start gap-3'>
                  <FaShieldAlt className='text-blue-600 mt-1 shrink-0' size={18} />
                  <div>
                    <p className='font-bold'>Bảo hành chính hãng</p>
                    <p className='text-gray-500'>Đổi mới trong 30 ngày nếu lỗi</p>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <FaTruck className='text-green-600 mt-1 shrink-0' size={18} />
                  <div>
                    <p className='font-bold'>Giao hàng siêu tốc</p>
                    <p className='text-gray-500'>Nhận hàng trong 2-3 ngày</p>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <FaUndo className='text-orange-500 mt-1 shrink-0' size={18} />
                  <div>
                    <p className='font-bold'>Dễ dàng đổi trả</p>
                    <p className='text-gray-500'>Hoàn tiền nếu không ưng ý</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Sản phẩm liên quan */}
            <div className='rounded-2xl bg-white p-5 shadow-sm border border-white'>
              <h2 className='text-lg font-bold mb-4 text-gray-800'>Sản phẩm tương tự</h2>
              <RelatedProducts currentId={id} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}