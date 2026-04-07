import { connectDB } from "src/lib/mongodb";
import { Product } from "src/models/Products"; 

export async function getAllProducts(search?: string) {
  await connectDB();
  
  const query = search 
    ? { name: { $regex: search, $options: 'i' } } 
    : {};

  return await Product.find(query).lean();
}

export async function getProductById(id: string) {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) return null; // Kiểm tra nếu ID không đúng định dạng MongoDB

  await connectDB();
  try {
    return await Product.findById(id).lean();
  } catch (error) {
    console.error("Lỗi lấy sản phẩm:", error);
    return null;
  }
}