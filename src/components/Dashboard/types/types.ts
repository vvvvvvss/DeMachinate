export enum UserType {
  BEGINNER = 'BEGINNER',
  INVESTOR = 'INVESTOR',
  DAY_TRADER = 'DAY_TRADER'
}

export interface WidgetType {
  id: string;
  type: 'watchlist' | 'alerts' | 'news' | 'metrics' | 'chart';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}
