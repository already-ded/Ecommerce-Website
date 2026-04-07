import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { Product } from "@/src/models/Products";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Đổi kiểu dữ liệu thành Promise
) {
  try {
    // 2. Phải await params trước khi lấy id
    const { id } = await params;

    // 3. Kiểm tra định dạng ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID sản phẩm không hợp lệ" }, { status: 400 });
    }

    await connectDB();

    // 4. Tìm sản phẩm theo id đã await
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...product,
      id: (product as any)._id.toString(),
    });

  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}