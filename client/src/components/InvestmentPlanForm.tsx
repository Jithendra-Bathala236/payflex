import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { paymentSdk } from "@/lib/paymentSdk";

interface InvestmentPlanFormProps {
  onSuccess?: () => void;
}

export const InvestmentPlanForm = ({ onSuccess }: InvestmentPlanFormProps) => {
  const { toast } = useToast();
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [riskAppetite, setRiskAppetite] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        throw new Error('Please login first');
      }

      const plan = await paymentSdk.createInvestmentPlan(
        accountId,
        Number(monthlyIncome),
        Number(savings),
        riskAppetite
      );

      toast({
        title: "Success",
        description: "Investment plan created successfully",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create investment plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="monthlyIncome">Monthly Income</Label>
        <Input
          id="monthlyIncome"
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder="Enter monthly income"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="savings">Current Savings</Label>
        <Input
          id="savings"
          type="number"
          value={savings}
          onChange={(e) => setSavings(e.target.value)}
          placeholder="Enter current savings"
          required
        />
      </div>

      <div>
        <Label htmlFor="riskAppetite">Risk Appetite</Label>
        <Select onValueChange={setRiskAppetite} required>
          <SelectTrigger>
            <SelectValue placeholder="Select risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Plan..." : "Create Investment Plan"}
      </Button>
    </form>
  );
};