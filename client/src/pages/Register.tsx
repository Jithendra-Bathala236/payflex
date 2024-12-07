import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { kycService } from "@/lib/kycService";
import { paymentSdk } from "@/lib/paymentSdk";

const Register = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState<"phone" | "otp" | "kyc">("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [kycData, setKycData] = useState({
        fullName: "",
        dateOfBirth: "",
        address: "",
        idNumber: "",
        email: "",
    });

    const handleSendOTP = async () => {
        try {
            await kycService.sendOTP(phoneNumber);
            setStep("otp");
            toast({
                title: "OTP Sent",
                description:
                    "Please check your phone for the verification code.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send OTP. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const verified = await kycService.verifyOTP(phoneNumber, otp);
            if (verified) {
                setStep("kyc");
                toast({
                    title: "Success",
                    description: "OTP verified successfully.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Invalid OTP. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Verification failed. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleSubmitKYC = async () => {
        try {
            await kycService.submitKYC({
                ...kycData,
                phoneNumber,
            });

            // Create payment account with required fields
            const res = await paymentSdk.createAccount({
                phoneNumber,
                fullName: kycData.fullName,
                email: kycData.email,
            });

            localStorage.setItem("phoneNumber", phoneNumber);
            localStorage.setItem("accountId", res.accountId);

            toast({
                title: "Success",
                description: "Account created successfully!",
            });

            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create account. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Create Account
                    </h2>

                    {step === "phone" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleSendOTP}
                                disabled={!phoneNumber}
                            >
                                Send OTP
                            </Button>
                        </div>
                    )}

                    {step === "otp" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleVerifyOTP}
                                disabled={!otp}
                            >
                                Verify OTP
                            </Button>
                        </div>
                    )}

                    {step === "kyc" && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={kycData.fullName}
                                    onChange={(e) =>
                                        setKycData({
                                            ...kycData,
                                            fullName: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={kycData.dateOfBirth}
                                    onChange={(e) =>
                                        setKycData({
                                            ...kycData,
                                            dateOfBirth: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={kycData.address}
                                    onChange={(e) =>
                                        setKycData({
                                            ...kycData,
                                            address: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your address"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idNumber">ID Number</Label>
                                <Input
                                    id="idNumber"
                                    value={kycData.idNumber}
                                    onChange={(e) =>
                                        setKycData({
                                            ...kycData,
                                            idNumber: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your ID number"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={kycData.email}
                                    onChange={(e) =>
                                        setKycData({
                                            ...kycData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your email"
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleSubmitKYC}
                                disabled={
                                    !Object.values(kycData).every(Boolean)
                                }
                            >
                                Submit KYC
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
