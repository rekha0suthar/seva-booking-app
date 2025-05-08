import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      code: String,
      title: String,
      discountedPrice: Number,
    },
  ],
  address: {
    type: {
      type: String,
    },
    addrLine1: String,
    addrLine2: String,
    pincode: String,
    city: String,
    state: String,
  },
  userContact: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);
