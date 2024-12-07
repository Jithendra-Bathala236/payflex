import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  planType: {
    type: String,
    enum: ['conservative', 'moderate', 'aggressive'],
    required: true,
  },
  monthlyInvestment: {
    type: Number,
    required: true,
  },
  riskAppetite: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  monthlyIncome: {
    type: Number,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Investment = mongoose.model('Investment', investmentSchema);