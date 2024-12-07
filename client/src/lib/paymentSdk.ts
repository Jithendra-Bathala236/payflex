import axios from "axios";

const API_URL = "http://localhost:8080/api";

export interface Transaction {
    id: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    timestamp: Date;
    status: "pending" | "completed" | "failed";
}

export interface Account {
    id: string;
    balance: number;
    transactions: Transaction[];
    accountId: string;
}

export interface CardDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

class PaymentSDK {
    private static instance: PaymentSDK;

    private constructor() {}

    public static getInstance(): PaymentSDK {
        if (!PaymentSDK.instance) {
            PaymentSDK.instance = new PaymentSDK();
        }
        return PaymentSDK.instance;
    }

    public async createAccount(data: {
        phoneNumber: string;
        fullName: string;
        email: string;
    }): Promise<Account> {
        const response = await axios.post(`${API_URL}/accounts`, data);
        return this.transformAccount(response.data);
    }

    public async getAccount(phoneNumber: string): Promise<Account | null> {
        try {
            const response = await axios.get(
                `${API_URL}/accounts/${phoneNumber}`
            );
            return this.transformAccount(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    public async processPayment(
        accountId: string,
        amount: number,
        description: string
    ): Promise<Transaction> {
        const response = await axios.post(`${API_URL}/transactions`, {
            accountId,
            amount,
            type: "credit",
            description,
        });
        return this.transformTransaction(response.data);
    }

    public async processCardPayment(
        accountId: string,
        amount: number,
        cardDetails: CardDetails,
        description: string
    ): Promise<Transaction> {
        const response = await axios.post(
            `${API_URL}/transactions/card-payment`,
            {
                accountId,
                amount,
                cardDetails,
                description,
            }
        );
        return this.transformTransaction(response.data);
    }

    public async getCreditScore(accountId: string): Promise<{
        score: number;
        paymentHistory: number;
        creditUtilization: number;
    }> {
        const response = await axios.get(
            `${API_URL}/credit-score/${accountId}`
        );
        return response.data;
    }

    public async predictLoanEligibility(
        accountId: string,
        loanAmount: number
    ): Promise<{
        eligible: boolean;
        maxAmount: number;
        interestRate: number;
        riskAssessment: string;
    }> {
        const response = await axios.post(
            `${API_URL}/credit-score/loan-eligibility`,
            {
                accountId,
                loanAmount,
            }
        );
        return response.data;
    }

    public async createInvestmentPlan(
        accountId: string,
        monthlyIncome: number,
        savings: number,
        riskAppetite: string
    ): Promise<{
        plan: {
            assetAllocation: Record<string, number>;
            monthlyInvestment: number;
            expectedReturns: number;
            vehicles: string[];
            timeline: string;
        };
        investment: {
            id: string;
            planType: string;
            monthlyInvestment: number;
            status: string;
        };
    }> {
        const response = await axios.post(`${API_URL}/investments/plan`, {
            accountId,
            monthlyIncome,
            savings,
            riskAppetite,
        });
        return response.data;
    }

    public async getInvestments(accountId: string): Promise<
        Array<{
            id: string;
            planType: string;
            monthlyInvestment: number;
            status: string;
            createdAt: Date;
        }>
    > {
        const response = await axios.get(
            `${API_URL}/investments/account/${accountId}`
        );
        return response.data;
    }

    private transformAccount(data: any): Account {
        return {
            id: data._id,
            balance: data.balance,
            transactions: [],
            accountId: data.accountId,
        };
    }

    private transformTransaction(data: any): Transaction {
        return {
            id: data._id,
            amount: data.amount,
            type: data.type,
            description: data.description,
            timestamp: new Date(data.createdAt),
            status: data.status,
        };
    }
}

export const paymentSdk = PaymentSDK.getInstance();
