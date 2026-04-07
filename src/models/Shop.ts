import mongoose, { Schema } from 'mongoose';

const ShopSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true },
  logo: String,
  businessEmail: String,
  taxCode: String,
  status: { type: String, enum: ['pending', 'active', 'disabled'], default: 'pending' },
  warehouseAddress: String,
  representative: {
    fullName: String,
    citizenId: String,
    phone: String
  }
}, { timestamps: true });

export const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);