import mongoose, { Schema } from 'mongoose';

const AddressSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverName: { type: String, required: true }, // Tên người nhận (có thể khác tên User)
  phoneNumber: { type: String, required: true },
  province: { type: String, required: true },    // Tỉnh/Thành phố
  district: { type: String, required: true },    // Quận/Huyện
  ward: { type: String, required: true },        // Phường/Xã
  detailAddress: { type: String, required: true }, // Số nhà, tên đường
  isDefault: { type: Boolean, default: false },
  addressType: { 
    type: String, 
    enum: ['home', 'office'], 
    default: 'home' 
  }
}, { timestamps: true });

export const Address = mongoose.models.Address || mongoose.model('Address', AddressSchema);