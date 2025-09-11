import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('YOUR_BACKEND_URL');
    setSocket(newSocket);

    newSocket.on('stockAlert', (alert: StockAlert) => {
      setAlerts(prev => [alert, ...prev]);
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(`Alert: ${alert.stockSymbol}`, {
          body: alert.message,
          icon: '/alert-icon.png'
        });
      }
    });

    return () => {
      newSocket.close();
    };
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
    socket?.emit('subscribeToStock', { symbol });
  };

  const unsubscribeFromStock = (symbol: string) => {
    socket?.emit('unsubscribeFromStock', { symbol });
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