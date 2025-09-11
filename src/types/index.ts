export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  priceChange: number;
  volumeChange: number;
  volatility: number;
  priceZScore: number;
  volumeZScore: number;
  anomalyScore: number;
  isAnomaly: boolean;
  manipulationProbability: number;
  predictedManipulation: boolean;
  pumpScore?: number;
  dumpScore?: number;
}

export interface SentimentData {
  date: string;
  tweetSentiment: number;
  newsSentiment: number;
  tweetCount: number;
  newsCount: number;
  sentimentZScore: number;
}

export interface AnalysisResults {
  stockData: StockData[];
  sentimentData: SentimentData[];
  summary: {
    totalDays: number;
    manipulationDays: number;
    manipulationPercentage: number;
    suspiciousDates: Array<{
      date: string;
      reasons: string[];
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
  modelMetrics: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  userType: UserType;
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD', 
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export enum UserType {
  BEGINNER = 'BEGINNER',
  INVESTOR = 'INVESTOR',
  DAY_TRADER = 'DAY_TRADER'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export enum CasePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum CaseType {
  PUMP_AND_DUMP = 'PUMP_AND_DUMP',
  INSIDER_TRADING = 'INSIDER_TRADING',
  SPOOFING = 'SPOOFING',
  WASH_TRADING = 'WASH_TRADING'
}

export interface Case {
  id: string;
  ticker: string;
  status: CaseStatus;
  priority: CasePriority;
  type: CaseType;
  created: string;
  description: string;
  assignedTo?: string;
  lastUpdated?: string;
}

export interface Alert {
  id: string;
  ticker: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'watchlist' | 'news' | 'alerts' | 'metrics' | 'activities';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config?: any;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  autoSwitchTime: { light: string; dark: string };
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  colorblindFriendly: boolean;
}
