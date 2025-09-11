// src/components/Alerts/AlertsPage.tsx
import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { useStockAlerts } from '../../contexts/StockAlertContext';

// Define Alert interface
interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'critical';
  timestamp: string;
  isRead: boolean;
  caseId?: string;
}

// Alert Card Component
type CombinedAlert = Alert & { isStockAlert?: boolean; details?: any };

const AlertCard: React.FC<{ alert: CombinedAlert; onMarkAsRead?: () => void }> = ({ alert, onMarkAsRead }) => {
  const getAlertColor = () => {
    switch (alert.type) {
      case 'warning': return 'border-yellow-200 dark:border-yellow-800';
      case 'critical': return 'border-red-200 dark:border-red-800';
      default: return 'border-blue-200 dark:border-blue-800';
    }
  };

  const handleClick = () => {
    if (!alert.isRead && onMarkAsRead) {
      onMarkAsRead();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`p-4 border-l-4 ${getAlertColor()} bg-white dark:bg-navy-800 rounded-r-lg shadow-sm cursor-pointer transition-all hover:scale-[1.01]`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
          <p className="text-sm text-gray-600 dark:text-navy-300">{alert.description}</p>
          {alert.caseId && (
            <span className="text-xs bg-gray-100 dark:bg-navy-700 px-2 py-1 rounded-full mr-2">
              Case: {alert.caseId}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-navy-400">
            {new Date(alert.timestamp).toLocaleString()}
          </span>
        </div>
        {!alert.isRead && (
          <div className="text-yellow-500">
            <Bell className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export const AlertsPage: React.FC = () => {
  const { alerts: stockAlerts, markAsRead: markStockAsRead } = useStockAlerts();
  const { alerts: generalAlerts, markAsRead: markGeneralAsRead } = useAlerts();
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine and format both types of alerts
  const combinedAlerts = [...stockAlerts.map(alert => ({
    id: alert.id,
    title: `${alert.stockSymbol} Alert`,
    description: alert.message,
    type: alert.severity === 'high' ? 'critical' : 'warning',
    timestamp: alert.timestamp.toISOString(),
    isRead: alert.isRead,
    details: alert.details,
    isStockAlert: true
  })), ...generalAlerts];

  const filteredAlerts = combinedAlerts.filter(alert => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !alert.isRead) ||
      (filter === 'critical' && alert.type === 'critical') ||
      (filter === 'stock' && 'isStockAlert' in alert);

    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = (alert: any) => {
    if ('isStockAlert' in alert) {
      markStockAsRead(alert.id);
    } else {
      markGeneralAsRead(alert.id);
    }
  };

  return (
    <div className="space-y-4 dark:bg-navy-900 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Alerts</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search alerts..."
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {['all', 'unread', 'critical', 'stock'].map((filterOption) => (
            <button 
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg ${
                filter === filterOption 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-white'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-navy-300">
            <CheckCircle className="mx-auto w-12 h-12 mb-4 opacity-50" />
            <p>No {filter === 'unread' ? 'unread' : ''} alerts</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert as CombinedAlert} 
              onMarkAsRead={() => handleMarkAsRead(alert)}
            />
          ))
        )}
      </div>
    </div>
  );
};