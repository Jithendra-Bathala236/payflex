import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CreditScoreCardProps {
  score: number;
  paymentHistory: number;
  creditUtilization: number;
}

export const CreditScoreCard = ({ score, paymentHistory, creditUtilization }: CreditScoreCardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Credit Score</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Overall Score</span>
            <span className="font-bold">{score}</span>
          </div>
          <Progress value={score / 8.5} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span>Payment History</span>
            <span>{paymentHistory}%</span>
          </div>
          <Progress value={paymentHistory} />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <span>Credit Utilization</span>
            <span>{creditUtilization}%</span>
          </div>
          <Progress value={creditUtilization} />
        </div>
      </div>
    </Card>
  );
};