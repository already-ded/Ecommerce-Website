import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { Product } from "@/src/models/Products";

export async function GET(req: Request) {
  try {
    // 1. Kết nối Database
    await connectDB();

    // 2. Lấy tham số từ URL
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");

    // 3. Xây dựng Object Query linh hoạt
    // Dùng kiểu 'any' hoặc 'Record<string, any>' để TS không báo lỗi khi thêm thuộc tính
    let mongoQuery: any = {};

    // Nếu có search: tìm theo tên (không phân biệt hoa thường)
    if (search) {
      mongoQuery.name = { $regex: search, $options: 'i' };
    }

    // Nếu có category: lọc chính xác theo danh mục
    if (category) {
      mongoQuery.category = category;
    }

    // 4. Truy vấn từ MongoDB với query đã tổng hợp
    // .sort({ createdAt: -1 }) để hiện sản phẩm mới nhất lên đầu
    const products = await Product.find(mongoQuery).sort({ createdAt: -1 }).lean();

    // 5. Map _id thành id để khớp với code Frontend
    const formattedProducts = products.map((p: any) => ({
      ...p,
      id: p._id.toString(),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}