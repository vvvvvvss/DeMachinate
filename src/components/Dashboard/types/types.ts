export enum UserType {
  BEGINNER = 'BEGINNER',
  INVESTOR = 'INVESTOR',
  DAY_TRADER = 'DAY_TRADER'
}

export interface WidgetType {
  id: string;
  type: 'watchlist' | 'alerts' | 'news' | 'metrics' | 'chart' | 'activities';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
}
