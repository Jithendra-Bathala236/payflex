export interface KYCData {
  fullName: string;
  dateOfBirth: string;
  address: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  verified: boolean;
}

class KYCService {
  private static instance: KYCService;
  private verifiedUsers: Map<string, KYCData> = new Map();

  private constructor() {}

  public static getInstance(): KYCService {
    if (!KYCService.instance) {
      KYCService.instance = new KYCService();
    }
    return KYCService.instance;
  }

  public async sendOTP(phoneNumber: string): Promise<string> {
    // Simulate OTP sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return '123456'; // In real app, this would be sent to the user's phone
  }

  public async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    // Simulate OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return otp === '123456';
  }

  public async submitKYC(data: Omit<KYCData, 'verified'>): Promise<KYCData> {
    // Simulate KYC verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const kycData: KYCData = {
      ...data,
      verified: true,
    };
    
    this.verifiedUsers.set(data.phoneNumber, kycData);
    return kycData;
  }

  public getKYCStatus(phoneNumber: string): KYCData | undefined {
    return this.verifiedUsers.get(phoneNumber);
  }
}

export const kycService = KYCService.getInstance();