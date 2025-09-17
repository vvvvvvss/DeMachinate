import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, TrendingUp, TrendingDown, BarChart2, RefreshCw } from 'lucide-react';

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

export default function AlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const WATCHED_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA'];
  
  // Mock data generator for fallback
  const generateMockStockData = (): StockData[] => {
    return WATCHED_SYMBOLS.map(symbol => {
      const basePrice = Math.random() * 200 + 50;
      const change = (Math.random() - 0.5) * 20;
      const changePercent = (change / basePrice) * 100;
      
      return {
        symbol,
        price: basePrice + change,
        previousClose: basePrice,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        averageVolume: Math.floor(Math.random() * 5000000) + 2000000,
        change,
        changePercent
      };
    });
  };

  const fetchStockData = async (symbol: string): Promise<StockData | null> => {
    try {
      // Try the Polygon API first
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=f4BXyKDQPJsoZYRXI4iW16AlB3o2J1zu`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log(`${symbol} API Response:`, data);
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`No data returned for ${symbol}`);
      }

      const result = data.results[0];
      const price = result.c || 0;
      const previousClose = result.o || 0;
      const change = price - previousClose;
      const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

      return {
        symbol,
        price,
        previousClose,
        volume: result.v || 0,
        averageVolume: result.v || 0, // Using same volume as average for now
        change,
        changePercent
      };
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error);
      return null;
    }
  };

  const generateAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setDebugInfo('Starting to fetch stock data...');

      console.log('Fetching data for symbols:', WATCHED_SYMBOLS);

      // Try to fetch real data first
      const stockPromises = WATCHED_SYMBOLS.map(fetchStockData);
      const results = await Promise.all(stockPromises);
      let stocksData = results.filter((data): data is StockData => data !== null);

      if (stocksData.length === 0) {
        setDebugInfo('API failed, using mock data for demonstration...');
        console.log('No valid data from API, using mock data');
        stocksData = generateMockStockData();
      } else {
        setDebugInfo(`Successfully fetched data for ${stocksData.length} stocks`);
      }

      console.log('Final stock data:', stocksData);

      // Generate risk-based alerts
      const newAlerts: Alert[] = [];
      
      stocksData.forEach((stock) => {
        // Volatile price movement alert
        if (Math.abs(stock.changePercent) > 2) {
          newAlerts.push({
            id: `${stock.symbol}-volatility-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: stock.changePercent > 0 ? 'High Volatility Up' : 'High Volatility Down',
            severity: Math.abs(stock.changePercent) > 5 ? 'critical' : 'high',
            message: `High volatility detected: ${Math.abs(stock.changePercent).toFixed(2)}% ${stock.changePercent > 0 ? 'upward' : 'downward'} movement`,
            timestamp: new Date().toLocaleTimeString(),
            isRead: false
          });
        }

        // Volume spike risk alert
        if (stock.volume > 0 && stock.averageVolume > 0) {
          const volumeRatio = stock.volume / stock.averageVolume;
          if (volumeRatio > 1.5) {
            newAlerts.push({
              id: `${stock.symbol}-volume-${Date.now()}-${Math.random()}`,
              ticker: stock.symbol,
              type: 'Unusual Volume',
              severity: volumeRatio > 2.5 ? 'critical' : 'high',
              message: `Unusual trading volume detected: ${volumeRatio.toFixed(1)}x normal volume`,
              timestamp: new Date().toLocaleTimeString(),
              isRead: false
            });
          }
        }

        // Price gap alert (comparing current price to previous close)
        if (stock.previousClose > 0) {
          const gapPercentage = Math.abs((stock.price - stock.previousClose) / stock.previousClose) * 100;
          if (gapPercentage > 3) {
            newAlerts.push({
              id: `${stock.symbol}-gap-${Date.now()}-${Math.random()}`,
              ticker: stock.symbol,
              type: 'Price Gap',
              severity: gapPercentage > 5 ? 'critical' : 'high',
              message: `Significant price gap of ${gapPercentage.toFixed(2)}% detected`,
              timestamp: new Date().toLocaleTimeString(),
              isRead: false
            });
          }
        }

        // Rapid price change alert
        if (Math.abs(stock.change) > 10) {
          newAlerts.push({
            id: `${stock.symbol}-rapid-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: 'Rapid Price Movement',
            severity: 'critical',
            message: `Extreme price movement of $${Math.abs(stock.change).toFixed(2)} detected`,
            timestamp: new Date().toLocaleTimeString(),
            isRead: false
          });
        }

        // Add a basic price movement alert for demonstration
        if (Math.abs(stock.changePercent) > 0.5) {
          newAlerts.push({
            id: `${stock.symbol}-movement-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: stock.changePercent > 0 ? 'Price Increase' : 'Price Decrease',
            severity: 'medium',
            message: `${stock.symbol} moved ${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}% to $${stock.price.toFixed(2)}`,
            timestamp: new Date().toLocaleTimeString(),
            isRead: false
          });
        }
      });

      // Update alerts with better sorting
      setAlerts(prevAlerts => {
        const allAlerts = [...newAlerts, ...prevAlerts];
        return allAlerts
          .sort((a, b) => {
            // Sort by severity first, then by timestamp
            const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
              return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          })
          .slice(0, 50);
      });

      console.log(`Generated ${newAlerts.length} alerts`);

    } catch (err) {
      console.error('Error in generateAlerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAlerts();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
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
    if (type.includes('Up') || type.includes('Increase')) {
      return <TrendingUp className="w-4 h-4" />;
    } else if (type.includes('Down') || type.includes('Decrease')) {
      return <TrendingDown className="w-4 h-4" />;
    } else if (type.includes('Volume')) {
      return <BarChart2 className="w-4 h-4" />;
    } else {
      return getSeverityIcon('medium');
    }
  };

  const markAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, isRead: true }))
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 text-lg">Market Alerts</h4>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">
            {alerts.filter(a => !a.isRead).length} unread
          </span>
          <button 
            onClick={markAllAsRead}
            className="text-xs text-teal-600 hover:text-teal-700"
          >
            Mark all read
          </button>
          <button 
            onClick={generateAlerts}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {debugInfo && (
        <div className="p-3 mb-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading && alerts.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.isRead 
                  ? 'bg-gray-50 border-gray-200 opacity-75' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded ${getSeverityColor(alert.severity)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-900">
                      {alert.ticker} - {alert.type}
                    </p>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && alerts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No alerts at the moment</p>
          <button 
            onClick={generateAlerts}
            className="mt-2 text-teal-600 hover:text-teal-700 text-sm"
          >
            Refresh to check for alerts
          </button>
        </div>
      )}

      <button 
        onClick={generateAlerts}
        className="w-full mt-4 py-2 text-sm text-teal-600 hover:text-teal-700 transition-colors border border-teal-200 rounded-lg hover:bg-teal-50"
      >
        Refresh Alerts
      </button>
    </div>
  );
}