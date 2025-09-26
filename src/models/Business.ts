export interface Business {
  businessId: string;
  ownerEmail: string; // Link to User
  businessName: string;
  businessType: string;
  location: string;
  startingBalance: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  primaryGoal: string;
  targetGrowth: string;
  phone: string;
  whatsappAlerts: boolean;
  emailReports: boolean;
  createdAt: string;
}