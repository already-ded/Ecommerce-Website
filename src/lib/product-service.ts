// src/lib/product-service.ts
import { connectDB } from "@/src/lib/mongodb";
import { Product } from "@/src/models/Products";
import mongoose from "mongoose";

export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean(); // .lean() giúp lấy object nhanh hơn

    if (!product) return null;

    // QUAN TRỌNG: Chuyển đổi mọi thứ thành Plain Object
    return {
      ...product,
      _id: product._id.toString(), // Chuyển ObjectId thành String
      id: product._id.toString(),  // Tạo trường id cho khớp với Frontend
      createdAt: product.createdAt?.toISOString(), 
      updatedAt: product.updatedAt?.toISOString(),
    };
  } catch (error) {
    return null;
  }
}