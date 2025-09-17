import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, TrendingUp, TrendingDown, BarChart2, RefreshCw, Wifi, WifiOff } from 'lucide-react';

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
  const [dataSource, setDataSource] = useState<'mock' | 'api'>('mock');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const WATCHED_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA'];
  
  // Realistic base prices for mock data
  const basePrices: Record<string, number> = {
    'AAPL': 175.50,
    'MSFT': 338.25,
    'GOOGL': 125.80,
    'NVDA': 485.60,
    'TSLA': 248.95
  };

  // Generate realistic mock stock data
  const generateRealisticStockData = (): StockData[] => {
    return WATCHED_SYMBOLS.map(symbol => {
      const basePrice = basePrices[symbol] || 100;
      
      // Generate realistic price movements (-3% to +3%)
      const changePercent = (Math.random() - 0.5) * 6;
      const change = (basePrice * changePercent) / 100;
      const currentPrice = basePrice + change;
      
      // Generate realistic volume (varies by stock)
      const baseVolume = symbol === 'AAPL' ? 50000000 : 
                        symbol === 'MSFT' ? 25000000 :
                        symbol === 'GOOGL' ? 20000000 :
                        symbol === 'NVDA' ? 35000000 : 30000000;
      
      const volumeMultiplier = 0.5 + Math.random() * 1.5; // 0.5x to 2x normal
      const volume = Math.floor(baseVolume * volumeMultiplier);
      const averageVolume = baseVolume;
      
      return {
        symbol,
        price: currentPrice,
        previousClose: basePrice,
        volume,
        averageVolume,
        change,
        changePercent
      };
    });
  };

  // Try alternative free APIs
  const fetchWithYahooFinance = async (symbol: string): Promise<StockData | null> => {
    try {
      // Yahoo Finance API (this might also have CORS issues)
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
      );
      
      if (!response.ok) throw new Error('Yahoo API failed');
      
      const data = await response.json();
      const result = data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators.quote[0];
      
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;
      
      return {
        symbol,
        price: currentPrice,
        previousClose,
        volume: quote.volume[quote.volume.length - 1] || 0,
        averageVolume: meta.averageVolume || 0,
        change,
        changePercent
      };
    } catch (error) {
      console.error(`Yahoo Finance API failed for ${symbol}:`, error);
      return null;
    }
  };

  const fetchWithAlphaVantage = async (symbol: string): Promise<StockData | null> => {
    try {
      // Alpha Vantage API (requires API key - using demo key)
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=EK5K4U7IWQUCELTL`
      );
      
      if (!response.ok) throw new Error('Alpha Vantage API failed');
      
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (!quote) throw new Error('No quote data');
      
      const price = parseFloat(quote['05. price']);
      const previousClose = parseFloat(quote['08. previous close']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      
      return {
        symbol,
        price,
        previousClose,
        volume: parseInt(quote['06. volume']),
        averageVolume: parseInt(quote['06. volume']), // Using current as average
        change,
        changePercent
      };
    } catch (error) {
      console.error(`Alpha Vantage API failed for ${symbol}:`, error);
      return null;
    }
  };

  const generateAlerts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching stock data...');
      
      let stocksData: StockData[] = [];
      
      // Try different APIs in sequence
      try {
        // First try Yahoo Finance
        console.log('Trying Yahoo Finance API...');
        const yahooPromises = WATCHED_SYMBOLS.map(fetchWithYahooFinance);
        const yahooResults = await Promise.all(yahooPromises);
        stocksData = yahooResults.filter((data): data is StockData => data !== null);
        
        if (stocksData.length > 0) {
          setDataSource('api');
          console.log('Yahoo Finance API successful');
        }
      } catch (error) {
        console.log('Yahoo Finance failed, trying Alpha Vantage...');
      }
      
      // If Yahoo fails, try Alpha Vantage (though demo key is limited)
      if (stocksData.length === 0) {
        try {
          const alphaPromises = WATCHED_SYMBOLS.slice(0, 1).map(fetchWithAlphaVantage); // Only try one with demo key
          const alphaResults = await Promise.all(alphaPromises);
          stocksData = alphaResults.filter((data): data is StockData => data !== null);
          
          if (stocksData.length > 0) {
            setDataSource('api');
            console.log('Alpha Vantage API successful');
          }
        } catch (error) {
          console.log('Alpha Vantage also failed');
        }
      }
      
      // If all APIs fail, use realistic mock data
      if (stocksData.length === 0) {
        console.log('All APIs failed, using realistic mock data');
        stocksData = generateRealisticStockData();
        setDataSource('mock');
      }

      console.log('Final stock data:', stocksData);
      setLastUpdate(new Date());

      // Generate risk-based alerts
      const newAlerts: Alert[] = [];
      
      stocksData.forEach((stock) => {
        const alertTimestamp = new Date().toLocaleTimeString();
        
        // Volatile price movement alert
        if (Math.abs(stock.changePercent) > 1.5) {
          newAlerts.push({
            id: `${stock.symbol}-volatility-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: stock.changePercent > 0 ? 'High Volatility Up' : 'High Volatility Down',
            severity: Math.abs(stock.changePercent) > 3 ? 'critical' : 'high',
            message: `High volatility detected: ${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}% movement to $${stock.price.toFixed(2)}`,
            timestamp: alertTimestamp,
            isRead: false
          });
        }

        // Volume spike alert
        if (stock.volume > 0 && stock.averageVolume > 0) {
          const volumeRatio = stock.volume / stock.averageVolume;
          if (volumeRatio > 1.3) {
            newAlerts.push({
              id: `${stock.symbol}-volume-${Date.now()}-${Math.random()}`,
              ticker: stock.symbol,
              type: 'Unusual Volume',
              severity: volumeRatio > 2 ? 'critical' : volumeRatio > 1.7 ? 'high' : 'medium',
              message: `Unusual trading volume: ${volumeRatio.toFixed(1)}x normal (${(stock.volume / 1000000).toFixed(1)}M shares)`,
              timestamp: alertTimestamp,
              isRead: false
            });
          }
        }

        // Significant price movement
        if (Math.abs(stock.changePercent) > 2) {
          newAlerts.push({
            id: `${stock.symbol}-movement-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: stock.changePercent > 0 ? 'Significant Rise' : 'Significant Drop',
            severity: Math.abs(stock.changePercent) > 4 ? 'critical' : 'high',
            message: `${stock.symbol} ${stock.changePercent > 0 ? 'surged' : 'dropped'} ${Math.abs(stock.changePercent).toFixed(2)}% (${stock.changePercent > 0 ? '+' : ''}$${stock.change.toFixed(2)})`,
            timestamp: alertTimestamp,
            isRead: false
          });
        }

        // Support/Resistance levels (mock)
        if (stock.price % 50 < 2 || stock.price % 50 > 48) {
          newAlerts.push({
            id: `${stock.symbol}-level-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: 'Key Level Alert',
            severity: 'medium',
            message: `${stock.symbol} approaching key level at $${Math.round(stock.price / 50) * 50}`,
            timestamp: alertTimestamp,
            isRead: false
          });
        }

        // Basic price update for active stocks
        if (Math.abs(stock.changePercent) > 0.3) {
          newAlerts.push({
            id: `${stock.symbol}-update-${Date.now()}-${Math.random()}`,
            ticker: stock.symbol,
            type: 'Price Update',
            severity: 'low',
            message: `${stock.symbol}: $${stock.price.toFixed(2)} (${stock.changePercent > 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`,
            timestamp: alertTimestamp,
            isRead: false
          });
        }
      });

      // Update alerts
      setAlerts(prevAlerts => {
        const allAlerts = [...newAlerts, ...prevAlerts];
        return allAlerts
          .sort((a, b) => {
            const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            if (severityOrder[a.severity] !== severityOrder[b.severity]) {
              return severityOrder[a.severity] - severityOrder[b.severity];
            }
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          })
          .slice(0, 20); // Keep last 20 alerts
      });

      console.log(`Generated ${newAlerts.length} alerts`);

    } catch (err) {
      console.error('Error in generateAlerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate alerts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAlerts();
    // Update every 30 seconds
    const interval = setInterval(generateAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
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
    if (type.includes('Up') || type.includes('Rise') || type.includes('surged')) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (type.includes('Down') || type.includes('Drop') || type.includes('dropped')) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    } else if (type.includes('Volume')) {
      return <BarChart2 className="w-4 h-4 text-purple-600" />;
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
        <div>
          <h4 className="font-medium text-gray-900 text-lg flex items-center gap-2">
            Market Alerts
            {dataSource === 'api' ? (
              <Wifi className="w-4 h-4 text-green-500" aria-label="Live data" />
            ) : (
              <WifiOff className="w-4 h-4 text-orange-500" aria-label="Demo data" />
            )}
          </h4>
          {lastUpdate && (
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()} 
              {dataSource === 'mock' && ' (Demo data)'}
            </p>
          )}
        </div>
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

      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {dataSource === 'mock' && (
        <div className="p-3 mb-4 bg-orange-50 text-orange-700 rounded-lg border border-orange-200">
          <strong>Demo Mode:</strong> Using simulated market data. Real-time data requires API access.
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
              className={`p-3 rounded-lg border transition-all duration-200 ${
                alert.isRead 
                  ? 'bg-gray-50 border-gray-200 opacity-75' 
                  : `bg-white ${getSeverityColor(alert.severity)} shadow-sm hover:shadow-md`
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
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
                  <p className="text-sm text-gray-700 mt-1">
                    {alert.message}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
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

      <div className="flex gap-2 mt-4">
        <button 
          onClick={generateAlerts}
          className="flex-1 py-2 text-sm text-teal-600 hover:text-teal-700 transition-colors border border-teal-200 rounded-lg hover:bg-teal-50"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Alerts'}
        </button>
      </div>
    </div>
  );
}
