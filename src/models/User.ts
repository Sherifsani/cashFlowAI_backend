export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  businessType: string;
  businessLocation: string;
  monthlyRevenue: string;
  employeeCount: string;
  alertPreference: string;
  hearAboutUs: string;
  createdAt: string;
}

export class UserModel implements User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string
  businessName: string;
  businessType: string;
  businessLocation: string;
  monthlyRevenue: string;
  employeeCount: string;
  alertPreference: string;
  hearAboutUs: string;
  createdAt: string;

  constructor(data: Omit<User, "createdAt">) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
  
    this.businessName = data.businessName;
    this.businessType = data.businessType;
    this.businessLocation = data.businessLocation;
    this.monthlyRevenue = data.monthlyRevenue;
    this.employeeCount = data.employeeCount;
    this.alertPreference = data.alertPreference;
    this.hearAboutUs = data.hearAboutUs;
    this.createdAt = new Date().toISOString();
  }

  // You can add methods for validation, etc.
}

