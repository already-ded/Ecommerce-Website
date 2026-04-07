// src/models/Profile.ts
import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  nickname: String,
  dob: {
    day: String,
    month: String,
    year: String
  },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  nationality: { type: String, default: 'VN' },
  phone: String,
  avatar: { type: String, default: 'https://i.pravatar.cc/150' }
});

export const Profile = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);