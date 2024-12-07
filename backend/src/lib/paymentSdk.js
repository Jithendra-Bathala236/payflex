import { Transaction } from '../models/Transaction.js';
import { Account } from '../models/Account.js';

class PaymentProcessor {
  async validateCard(cardNumber, expiryDate, cvv) {
    // Simple Luhn algorithm for card validation
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  async processCardPayment(accountId, amount, cardDetails, description) {
    try {
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const isCardValid = await this.validateCard(
        cardDetails.cardNumber,
        cardDetails.expiryDate,
        cardDetails.cvv
      );

      if (!isCardValid) {
        throw new Error('Invalid card details');
      }

      // Create transaction record
      const transaction = new Transaction({
        accountId,
        amount,
        type: 'credit',
        description,
        status: 'completed',
      });

      await transaction.save();

      // Update account balance
      account.balance += amount;
      await account.save();

      return transaction;
    } catch (error) {
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }
}

export const paymentProcessor = new PaymentProcessor();