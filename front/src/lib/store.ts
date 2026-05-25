import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  User, Project, Transaction, BuybackRequest,
  Complaint, AdminNote, PortfolioItem, UserRole,
  VerificationStatus, ComplaintStatus, BuybackStatus
} from './types';
import {
  mockUsers, mockProjects, mockTransactions,
  mockBuybacks, mockComplaints, mockAdminNotes, mockPortfolio
} from './mockData';

export interface AppState {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  transactions: Transaction[];
  buybackRequests: BuybackRequest[];
  complaints: Complaint[];
  adminNotes: AdminNote[];
  portfolio: PortfolioItem[];
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'UPDATE_VERIFICATION'; payload: { userId: string; status: VerificationStatus } }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BUYBACK'; payload: BuybackRequest }
  | { type: 'UPDATE_BUYBACK'; payload: { id: string; status: BuybackStatus } }
  | { type: 'ADD_COMPLAINT'; payload: Complaint }
  | { type: 'UPDATE_COMPLAINT'; payload: { id: string; status: ComplaintStatus } }
  | { type: 'ADD_ADMIN_NOTE'; payload: AdminNote }
  | { type: 'ISSUE_TOKENS'; payload: { projectId: string; amount: number } }
  | { type: 'BURN_TOKENS'; payload: { projectId: string; amount: number } }
  | { type: 'ADD_PORTFOLIO_ITEM'; payload: PortfolioItem }
  | { type: 'UPDATE_PORTFOLIO'; payload: { projectId: string; amount: number } };

const initialState: AppState = {
  currentUser: null,
  users: mockUsers,
  projects: mockProjects,
  transactions: mockTransactions,
  buybackRequests: mockBuybacks,
  complaints: mockComplaints,
  adminNotes: mockAdminNotes,
  portfolio: mockPortfolio,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'REGISTER_USER':
      return { ...state, users: [...state.users, action.payload], currentUser: action.payload };
    case 'UPDATE_VERIFICATION':
      return {
        ...state,
        users: state.users.map(u =>
          u.id === action.payload.userId ? { ...u, verificationStatus: action.payload.status } : u
        ),
        currentUser: state.currentUser?.id === action.payload.userId
          ? { ...state.currentUser, verificationStatus: action.payload.status }
          : state.currentUser,
      };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'ADD_BUYBACK':
      return { ...state, buybackRequests: [...state.buybackRequests, action.payload] };
    case 'UPDATE_BUYBACK':
      return {
        ...state,
        buybackRequests: state.buybackRequests.map(b =>
          b.id === action.payload.id ? { ...b, status: action.payload.status } : b
        ),
      };
    case 'ADD_COMPLAINT':
      return { ...state, complaints: [...state.complaints, action.payload] };
    case 'UPDATE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        ),
      };
    case 'ADD_ADMIN_NOTE':
      return { ...state, adminNotes: [...state.adminNotes, action.payload] };
    case 'ISSUE_TOKENS':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? {
                ...p,
                totalSupply: p.totalSupply + action.payload.amount,
                availableSupply: p.availableSupply + action.payload.amount,
              }
            : p
        ),
      };
    case 'BURN_TOKENS':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? {
                ...p,
                totalSupply: p.totalSupply - action.payload.amount,
                availableSupply: p.availableSupply - action.payload.amount,
              }
            : p
        ),
      };
    case 'ADD_PORTFOLIO_ITEM':
      return { ...state, portfolio: [...state.portfolio, action.payload] };
    case 'UPDATE_PORTFOLIO': {
      const existing = state.portfolio.find(p => p.projectId === action.payload.projectId);
      if (existing) {
        return {
          ...state,
          portfolio: state.portfolio.map(p =>
            p.projectId === action.payload.projectId
              ? { ...p, amount: p.amount + action.payload.amount, totalValue: (p.amount + action.payload.amount) * p.currentPrice }
              : p
          ),
        };
      }
      return state;
    }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return React.createElement(AppContext.Provider, { value: { state, dispatch } }, children);
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
