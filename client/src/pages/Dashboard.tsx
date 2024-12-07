import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { paymentSdk } from "@/lib/paymentSdk";
import { CardPaymentForm } from "@/components/CardPaymentForm";
import { CreditScoreCard } from "@/components/CreditScoreCard";
import { InvestmentPlanForm } from "@/components/InvestmentPlanForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DashboardData {
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
  }>;
  creditScore: {
    score: number;
    paymentHistory: number;
    creditUtilization: number;
  };
  investments: Array<{
    id: string;
    planType: string;
    monthlyInvestment: number;
    status: string;
    createdAt: Date;
  }>;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const phoneNumber = localStorage.getItem('phoneNumber');
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    try {
      const account = await paymentSdk.getAccount(phoneNumber);
      if (account) {
        const accountId = account.id;
        const [creditScore, investments] = await Promise.all([
          paymentSdk.getCreditScore(accountId),
          paymentSdk.getInvestments(accountId),
        ]);

        setData({
          balance: account.balance,
          transactions: account.transactions,
          creditScore,
          investments,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch account data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Balance</h2>
            <p className="text-4xl font-bold text-primary">₹{data.balance.toFixed(2)}</p>
          </Card>

          <CreditScoreCard {...data.creditScore} />
        </div>

        <div className="space-y-8">
          <Tabs defaultValue="add-money">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add-money">Add Money</TabsTrigger>
              <TabsTrigger value="invest">Invest</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add-money">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Add Money via Card</h2>
                <CardPaymentForm onSuccess={fetchData} />
              </Card>
            </TabsContent>
            
            <TabsContent value="invest">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Create Investment Plan</h2>
                <InvestmentPlanForm onSuccess={fetchData} />
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {data.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={`font-bold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      transaction.status === 'completed' ? 'text-green-500' : 
                      transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;