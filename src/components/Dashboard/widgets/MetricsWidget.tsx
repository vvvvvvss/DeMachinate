import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

export const MetricsWidget: React.FC = () => {
  const metrics = [
    {
      label: 'Market Sentiment',
      value: '+0.23',
      change: '+0.05',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Volatility Index',
      value: '18.4',
      change: '-2.1',
      trend: 'down',
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Risk Alerts',
      value: '7',
      change: '+3',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Active Cases',
      value: '12',
      change: '+1',
      trend: 'up',
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'red': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'blue': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <div
            key={index}
            className="p-3 bg-gray-50 dark:bg-navy-700 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1 rounded ${getColorClasses(metric.color)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                metric.trend === 'up' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <TrendIcon className="w-3 h-3" />
                <span>{metric.change}</span>
              </div>
            </div>
            
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {metric.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};