import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router as accountRoutes } from "./routes/accounts.js";
import { router as transactionRoutes } from "./routes/transactions.js";
import { router as investmentRoutes } from "./routes/investments.js";
import { router as creditScoreRoutes } from "./routes/creditScore.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/credit-score", creditScoreRoutes);

// Connect to MongoDB
mongoose
    .connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/payment-gateway"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
