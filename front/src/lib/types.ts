export type UserRole = 'BUSINESS' | 'INDIVIDUAL' | 'BUYER' | 'ADMIN';
export type VerificationStatus = 'verified' | 'under_review' | 'not_verified' | 'blocked';
export type TransactionType = 'BUY' | 'SELL' | 'CLAIM';
export type BuybackStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type ComplaintStatus = 'OPEN' | 'RESOLVED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  firstName: string;
  lastName: string;
  phone?: string;
  citizenship?: string;
  representativePosition?: string;
  legalEntityName?: string;
  countryOfIncorporation?: string;
  projectName?: string;
  projectDescription?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  profitabilityStrategy: string;
  tokenAddress: string;
  tokenSymbol: string;
  totalSupply: number;
  availableSupply: number;
  priceUsd: number;
  createdAt: string;
  issuerName: string;
  issuerVerified: VerificationStatus;
}

export interface Transaction {
  id: string;
  buyerId: string;
  projectId: string;
  amount: number;
  priceAtPurchase: number;
  txHash: string;
  type: TransactionType;
  createdAt: string;
}

export interface BuybackRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  projectId: string;
  tokenAmount: number;
  status: BuybackStatus;
  createdAt: string;
}

export interface Complaint {
  id: string;
  submitterId: string;
  submitterName: string;
  submitterEmail: string;
  projectId: string;
  text: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface AdminNote {
  id: string;
  adminId: string;
  targetUserId: string;
  note: string;
  createdAt: string;
}

export interface PortfolioItem {
  projectId: string;
  projectName: string;
  tokenSymbol: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  issuerVerified: VerificationStatus;
  description: string;
}
