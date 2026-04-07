// src/models/Product.ts
import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true, index: true },
  image: { type: String, required: true },
  galleryImages: [String],
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  rating: { type: Number, default: 0 },
  category: { type: String, required: true, index: true },
  brand: String,
  stock: { type: Number, default: 0 },
  status: { type: String, default: 'available' },
  description: String,
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' }, // Liên kết với người bán
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);