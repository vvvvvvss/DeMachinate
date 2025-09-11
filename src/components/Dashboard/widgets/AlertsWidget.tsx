import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Alert } from '../../../types';

export const AlertsWidget: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: '1',
      ticker: 'XYZ',
      type: 'Pump Pattern',
      severity: 'high',
      message: 'Unusual price spike detected with high social media activity',
      timestamp: '09:45 AM',
      isRead: false
    },
    {
      id: '2',
      ticker: 'ABC',
      type: 'Volume Anomaly',
      severity: 'medium',
      message: 'Trading volume 3x above average',
      timestamp: '10:15 AM',
      isRead: false
    },
    {
      id: '3',
      ticker: 'DEF',
      type: 'Sentiment Shift',
      severity: 'low',
      message: 'Negative sentiment trend detected',
      timestamp: '11:30 AM',
      isRead: true
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30';
      case 'high': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">Recent Alerts</h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {alerts.filter(a => !a.isRead).length} unread
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              alert.isRead 
                ? 'bg-gray-50 dark:bg-navy-700 border-gray-200 dark:border-navy-600 opacity-75' 
                : 'bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-600 shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {alert.ticker} - {alert.type}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
        View All Alerts
      </button>
    </div>
  );
};