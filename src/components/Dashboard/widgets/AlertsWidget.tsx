import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';

interface Alert {
  id: string;
  ticker: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface StockData {
  symbol: string;
  price: number;
  previousClose: number;
  volume: number;
  averageVolume: number;
  change: number;
  changePercent: number;
}

export const AlertsWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const WATCHED_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA'];
  
  const generateAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stockDataPromises = WATCHED_SYMBOLS.map(async (symbol) => {
        // Add delay between requests to avoid API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=EK5K4U7IWQUCELTL`
        );

        if (!response.ok) throw new Error(`Failed to fetch data for ${symbol}`);
        
        const data = await response.json();
        
        if (data['Note']) {
          throw new Error('API rate limit reached. Please try again later.');
        }

        const quote = data['Global Quote'];
        return {
          symbol,
          price: parseFloat(quote['05. price']),
          previousClose: parseFloat(quote['08. previous close']),
          volume: parseInt(quote['06. volume']),
          averageVolume: parseInt(quote['06. volume']), // Using current volume as we don't have average
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
        };
      });

      const stocksData = await Promise.all(stockDataPromises);
      
      // Generate real alerts based on market conditions
      const newAlerts: Alert[] = [];
      
      stocksData.forEach((stock) => {
        // Price change alerts
        if (Math.abs(stock.changePercent) > 2) {
          newAlerts.push({
            id: `${stock.symbol}-price-${Date.now()}`,
            ticker: stock.symbol,
            type: stock.changePercent > 0 ? 'Significant Rise' : 'Significant Drop',
            severity: Math.abs(stock.changePercent) > 5 ? 'critical' : 'high',
            message: `Price ${stock.changePercent > 0 ? 'up' : 'down'} ${Math.abs(stock.changePercent).toFixed(2)}% to $${stock.price.toFixed(2)}`,
            timestamp: new Date().toLocaleTimeString(),
            isRead: false
          });
        }

        // Volume alerts
        const volumeRatio = stock.volume / stock.averageVolume;
        if (volumeRatio > 1.5) {
          newAlerts.push({
            id: `${stock.symbol}-volume-${Date.now()}`,
            ticker: stock.symbol,
            type: 'Volume Surge',
            severity: volumeRatio > 2 ? 'high' : 'medium',
            message: `Trading volume ${volumeRatio.toFixed(1)}x above average`,
            timestamp: new Date().toLocaleTimeString(),
            isRead: false
          });
        }
      });

      // Update alerts - keep recent ones
      setAlerts(prevAlerts => {
        const allAlerts = [...newAlerts, ...prevAlerts];
        // Keep only last 24 hours of alerts
        return allAlerts
          .filter(alert => {
            const alertTime = new Date(alert.timestamp);
            const hoursDiff = (Date.now() - alertTime.getTime()) / (1000 * 60 * 60);
            return hoursDiff < 24;
          })
          .slice(0, 50); // Keep maximum 50 alerts
      });

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAlerts();
    // Update every 5 minutes
    const interval = setInterval(generateAlerts, 300000);
    return () => clearInterval(interval);
  }, []);

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Significant Rise':
        return <TrendingUp className="w-4 h-4" />;
      case 'Significant Drop':
        return <TrendingDown className="w-4 h-4" />;
      case 'Volume Surge':
        return <BarChart2 className="w-4 h-4" />;
      default:
        return getSeverityIcon('medium');
    }
  };

  const markAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, isRead: true }))
    );
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-navy-800 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">Market Alerts</h4>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {alerts.filter(a => !a.isRead).length} unread
          </span>
          <button 
            onClick={markAllAsRead}
            className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700"
          >
            Mark all read
          </button>
          <button 
            onClick={generateAlerts}
            className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full"
            disabled={isLoading}
          >
            <Clock className={`w-4 h-4 text-gray-500 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && alerts.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.isRead 
                  ? 'bg-gray-50 dark:bg-navy-700 border-gray-200 dark:border-navy-600 opacity-75' 
                  : 'bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-600 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                  {getAlertIcon(alert.type)}
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
      )}

      {!isLoading && alerts.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No alerts at the moment
        </div>
      )}

      <button className="w-full py-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
        View All Alerts
      </button>
    </div>
  );
};