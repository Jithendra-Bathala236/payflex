import express from 'express';
import { Account } from '../models/Account.js';
import { Transaction } from '../models/Transaction.js';

export const router = express.Router();

// Get credit score for an account
router.get('/:accountId', async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Get all transactions for this account
    const transactions = await Transaction.find({ accountId: req.params.accountId });

    // Calculate payment history (percentage of successful transactions)
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === 'completed').length;
    const paymentHistory = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 100;

    // Calculate credit utilization (based on current balance vs initial balance)
    const initialBalance = 1000; // Default initial balance
    const creditUtilization = ((initialBalance - account.balance) / initialBalance) * 100;

    // Calculate credit score based on payment history and credit utilization
    const baseScore = 300;
    const maxScore = 850;
    const paymentHistoryWeight = 0.65;
    const creditUtilizationWeight = 0.35;

    const score = Math.round(
      baseScore +
      (paymentHistoryWeight * paymentHistory * 5.5) +
      (creditUtilizationWeight * (100 - creditUtilization) * 5.5)
    );

    // Ensure score stays within valid range
    const finalScore = Math.max(300, Math.min(score, maxScore));

    res.json({
      score: finalScore,
      paymentHistory,
      creditUtilization
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check loan eligibility
router.post('/loan-eligibility', async (req, res) => {
  try {
    const { accountId, loanAmount } = req.body;

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Get credit score
    const transactions = await Transaction.find({ accountId });
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === 'completed').length;
    const paymentHistory = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 100;
    const creditUtilization = ((1000 - account.balance) / 1000) * 100;

    const baseScore = 300;
    const score = Math.round(
      baseScore +
      (0.65 * paymentHistory * 5.5) +
      (0.35 * (100 - creditUtilization) * 5.5)
    );

    // Determine loan eligibility based on credit score
    const eligible = score >= 650;
    const maxAmount = eligible ? Math.min(account.balance * 3, 50000) : 0;
    const interestRate = score >= 750 ? 8.5 : score >= 700 ? 10.5 : 12.5;

    // Risk assessment based on credit score
    let riskAssessment = 'High Risk';
    if (score >= 750) riskAssessment = 'Low Risk';
    else if (score >= 700) riskAssessment = 'Medium Risk';

    res.json({
      eligible,
      maxAmount,
      interestRate,
      riskAssessment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});