import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiService = {
    async predictLoanEligibility(creditScore, income, loanAmount) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Based on the following financial data:
    - Credit Score: ${creditScore}
    - Monthly Income: ${income}
    - Requested Loan Amount: ${loanAmount}
    
    Analyze loan eligibility and provide:
    1. Eligibility status (Yes/No)
    2. Maximum recommended loan amount
    3. Recommended interest rate
    4. Risk assessment
    
    Format the response as JSON.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return JSON.parse(response.text());
    },

    async createInvestmentPlan(monthlyIncome, savings, riskAppetite) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Create an investment plan based on:
    - Monthly Income: ${monthlyIncome}
    - Current Savings: ${savings}
    - Risk Appetite: ${riskAppetite}
    
    Provide:
    1. Recommended asset allocation
    2. Monthly investment amount
    3. Expected returns (conservative estimate)
    4. Investment vehicles (specific funds/instruments)
    5. Timeline recommendations
    6. How to invest in which segements
    
    Format the response as JSON, Don't mention \`\`\`JSON. so that JSON.parse function can parse it, Make sure percentage values for Numbers.
    For example:
    {
        "recommendedPlan": "Balanced",
        "monthlyInvestment": 500,
        "expectedReturns": 7.5,
        "investmentVehicles": ["Index Funds", "ETFs"],
        "timeline": "5 years",
        "investmentSegments": {
            "Equities": 50,
            "Bonds": 30,
            "Real Estate": 10,
            "Commodities": 10

        }
        targetAmount: 50000
    }
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        return JSON.parse(response.text());
    },
};
