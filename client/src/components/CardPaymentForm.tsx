import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { paymentSdk } from "@/lib/paymentSdk";

interface CardPaymentFormProps {
    onSuccess?: () => void;
}

export const CardPaymentForm = ({ onSuccess }: CardPaymentFormProps) => {
    const { toast } = useToast();
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const accountId = localStorage.getItem("accountId");
            if (!accountId) {
                throw new Error("Please login first");
            }

            await paymentSdk.processPayment(
                accountId,
                Number(amount),
                description
            );

            toast({
                title: "Success",
                description: "Payment processed successfully",
            });

            setAmount("");
            setDescription("");

            onSuccess?.();
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error ? error.message : "Payment failed",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    required
                />
            </div>

            <div>
                <Label htmlFor="amount">Description</Label>
                <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    required
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
            </Button>
        </form>
    );
};
