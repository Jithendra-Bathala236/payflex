import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 1000,
  },
  fullName: String,
  email: String,
  kycVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Account = mongoose.model('Account', accountSchema);