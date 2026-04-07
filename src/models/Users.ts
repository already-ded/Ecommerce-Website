// src/models/User.ts
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Nên lưu hash bcrypt
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  shopStatus: { type: String, enum: ['none', 'pending', 'active', 'rejected'], default: 'none' }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

