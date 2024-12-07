import express from "express";
import { Transaction } from "../models/Transaction.js";
import { Account } from "../models/Account.js";
import { paymentProcessor } from "../lib/paymentSdk.js";

export const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { accountId, amount, type, description } = req.body;

        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }

        if (type === "debit" && account.balance < amount) {
            return res.status(400).json({ error: "Insufficient funds" });
        }

        const transaction = new Transaction({
            accountId,
            amount,
            type,
            description,
            status: "completed",
        });

        await transaction.save();

        // Update account balance
        account.balance += type === "credit" ? amount : -amount;
        await account.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/account/:accountId", async (req, res) => {
    try {
        const transactions = await Transaction.find({
            accountId: req.params.accountId,
        }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/card-payment", async (req, res) => {
    try {
        const { accountId, amount, cardDetails, description } = req.body;

        const transaction = await paymentProcessor.processCardPayment(
            accountId,
            amount,
            cardDetails,
            description
        );

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
