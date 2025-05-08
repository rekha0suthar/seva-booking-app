import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  contact: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Invalid mobile number'],
    unique: true,
  },
  name: String,
  email: String,
  verified: { type: Boolean, default: false },
});

export default mongoose.model('User', userSchema);
