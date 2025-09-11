import React, { createContext, useContext, useState, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';


export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'critical';
  timestamp: string;
  isRead: boolean;
  caseId?: string;
  triggerCondition?: string;
}

interface AlertContextType {
  alerts: Alert[];
  markAsRead: (id: string) => void;
  unreadCount: number;
  subscribeToCase: (caseId: string, conditions: string[]) => void;
  unsubscribeFromCase: (caseId: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [subscribedCases, setSubscribedCases] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    const newSocket = io('YOUR_BACKEND_URL');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('newAlert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => {
      socket.off('newAlert');
    };
  }, [socket]);

  const markAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const subscribeToCase = (caseId: string, conditions: string[]) => {
    if (socket) {
      socket.emit('subscribeToCase', { caseId, conditions });
      setSubscribedCases(prev => {
        const updated = new Map(prev);
        updated.set(caseId, conditions);
        return updated;
      });
    }
  };

  const unsubscribeFromCase = (caseId: string) => {
    if (socket) {
      socket.emit('unsubscribeFromCase', { caseId });
      setSubscribedCases(prev => {
        const updated = new Map(prev);
        updated.delete(caseId);
        return updated;
      });
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      markAsRead, 
      unreadCount,
      subscribeToCase,
      unsubscribeFromCase
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};