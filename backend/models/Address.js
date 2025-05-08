import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  addrLine1: String,
  addrLine2: String,
  pincode: String,
  city: String,
  state: String,
  verified: { type: Boolean, default: true },
});

export default mongoose.model('Address', addressSchema);
