import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    contact: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'],
    },
    countryCode: {
      type: String,
      required: true,
      match: [/^\\+[1-9]{1}[0-9]{1,2}$/, 'Invalid country code format'],
    },
    name: {
      type: String,
      required: function () {
        return !this.verified;
      },
    },
    email: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);
export default User;
