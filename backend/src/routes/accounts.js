import express from "express";
import { Account } from "../models/Account.js";

export const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const account = new Account(req.body);
        await account.save();
        res.status(201).json({ ...account, accountId: account._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:phoneNumber", async (req, res) => {
    try {
        const account = await Account.findOne({
            phoneNumber: req.params.phoneNumber,
        });
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
