import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Activity } from 'lucide-react';
import { useStockAlerts } from '../../contexts/StockAlertContext';

export const AlertsPage: React.FC = () => {
  const { alerts, markAsRead, markAllAsRead } = useStockAlerts();
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_manipulation': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'volume_spike': return <Activity className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Stock Alerts</h1>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'high', 'medium', 'low'].map((severity) => (
          <button
            key={severity}
            onClick={() => setFilter(severity as any)}
            className={`px-4 py-2 rounded-lg ${
              filter === severity 
                ? 'bg-navy-800 text-white' 
                : 'bg-gray-100 dark:bg-navy-700'
            }`}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 border-l-4 ${
              alert.isRead ? 'border-gray-300' : 'border-teal-500'
            } bg-white dark:bg-navy-800 rounded-lg shadow-sm`}
            onClick={() => markAsRead(alert.id)}
          >
            <div className="flex items-start gap-4">
              {getAlertIcon(alert.alertType)}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg dark:text-white">
                    {alert.stockSymbol}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {alert.message}
                </p>
                {alert.details && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {alert.details.previousPrice && (
                      <span className="mr-4">
                        Price: ${alert.details.previousPrice} → ${alert.details.currentPrice}
                      </span>
                    )}
                    {alert.details.previousVolume && (
                      <span>
                        Volume: {alert.details.previousVolume.toLocaleString()} → {alert.details.currentVolume?.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};