import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StockAlert {
  id: string;
  stockSymbol: string;
  alertType: 'price_manipulation' | 'volume_spike' | 'unusual_activity';
  message: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
  isRead: boolean;
  details?: {
    previousPrice?: number;
    currentPrice?: number;
    previousVolume?: number;
    currentVolume?: number;
  };
}

interface StockAlertContextType {
  alerts: StockAlert[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  subscribeToStock: (symbol: string) => void;
  unsubscribeFromStock: (symbol: string) => void;
}

const StockAlertContext = createContext<StockAlertContextType | undefined>(undefined);

export const StockAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  // Dummy real-time simulation (replace with WebSocket in production)
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: StockAlert = {
        id: Math.random().toString(36).substr(2, 9),
        stockSymbol: ['AAPL', 'TSLA', 'GOOG'][Math.floor(Math.random() * 3)],
        alertType: 'price_manipulation',
        message: 'Suspected price manipulation detected.',
        timestamp: new Date(),
        severity: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
        isRead: false,
        details: {
          previousPrice: Math.random() * 100 + 100,
          currentPrice: Math.random() * 100 + 200,
        }
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const subscribeToStock = (symbol: string) => {
    // Implement real subscription logic here
  };

  const unsubscribeFromStock = (symbol: string) => {
    // Implement real unsubscription logic here
  };

  return (
    <StockAlertContext.Provider value={{
      alerts,
      unreadCount,
      markAsRead,
      markAllAsRead,
      subscribeToStock,
      unsubscribeFromStock
    }}>
      {children}
    </StockAlertContext.Provider>
  );
};

export const useStockAlerts = () => {
  const context = useContext(StockAlertContext);
  if (!context) {
    throw new Error('useStockAlerts must be used within a StockAlertProvider');
  }
  return context;
};