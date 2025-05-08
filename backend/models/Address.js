import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userContact: { type: String, required: true }, // link to user by contact
  type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  addrLine1: String,
  addrLine2: String,
  pincode: String,
  city: String,
  state: String,
  verified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Address', addressSchema);
