import express from "express";
import { Investment } from "../models/Investment.js";
import { geminiService } from "../lib/geminiService.js";

export const router = express.Router();

router.post("/plan", async (req, res) => {
    try {
        const { accountId, monthlyIncome, savings, riskAppetite } = req.body;

        const investmentPlan = await geminiService.createInvestmentPlan(
            monthlyIncome,
            savings,
            riskAppetite
        );

        // console.log(investmentPlan);

        const investment = new Investment({
            accountId,
            planType: investmentPlan.recommendedPlan,
            monthlyInvestment: investmentPlan.monthlyInvestment,
            riskAppetite,
            monthlyIncome,
            targetAmount: investmentPlan.targetAmount,
        });

        await investment.save();
        res.status(201).json({ investment, plan: investmentPlan });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

router.get("/account/:accountId", async (req, res) => {
    try {
        const investments = await Investment.find({
            accountId: req.params.accountId,
        });
        res.json(investments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
