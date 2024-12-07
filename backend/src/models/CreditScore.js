import mongoose from 'mongoose';

const creditScoreSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  paymentHistory: {
    type: Number,
    required: true,
  },
  creditUtilization: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const CreditScore = mongoose.model('CreditScore', creditScoreSchema);