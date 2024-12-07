import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to FinTech Simulator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of digital banking and payments
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary/90"
            >
              Create Account
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;