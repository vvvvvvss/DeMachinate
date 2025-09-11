import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { RefreshCw } from 'lucide-react';

interface StockData {
  date: string;
  price: number;
  volume: number;
  change: number;
  symbol: string; // Add this line
}

interface ChartWidgetProps {
  symbols?: string[];  // Change from single symbol to array
  interval?: '1D' | '1W' | '1M' | '3M' | '1Y';
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ 
  symbols = ['AAPL'], // Default to AAPL
  interval = '1M'
}) => {
  const [data, setData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState(interval);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(symbols);
  const [newSymbol, setNewSymbol] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStockData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const allData = await Promise.all(
        selectedSymbols.map(async (sym) => {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${sym}&apikey=EK5K4U7IWQUCELTL`
          );
          
          if (!response.ok) throw new Error(`Failed to fetch data for ${sym}`);
          
          const jsonData = await response.json();
          
          if (jsonData.hasOwnProperty('Note')) {
            throw new Error('API rate limit exceeded. Please try again later.');
          }

          const timeSeriesData = jsonData['Time Series (Daily)'];
          
          if (!timeSeriesData) {
            throw new Error(`No data available for ${sym}`);
          }

          return Object.entries(timeSeriesData)
            .map(([date, values]: [string, any]) => ({
              date: new Date(date).toLocaleDateString(),
              price: parseFloat(values['4. close']),
              volume: parseFloat(values['5. volume']),
              change: parseFloat(values['4. close']) - parseFloat(values['1. open']),
              symbol: sym
            }))
            .filter(item => !isNaN(item.price))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-30);
        })
      );

      setData(allData.flat());
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stock data');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [symbols, selectedInterval]);

  useEffect(() => {
    console.log('Current chart data:', data);
  }, [data]);

  const latestPrice = data[data.length - 1]?.price || 0;
  const previousPrice = data[data.length - 2]?.price || 0;
  const priceChange = ((latestPrice - previousPrice) / previousPrice) * 100;

  const intervals = ['1D', '1W', '1M', '3M', '1Y'] as const;

  const handleAddSymbol = () => {
    if (newSymbol && !selectedSymbols.includes(newSymbol.toUpperCase())) {
      setSelectedSymbols(prev => [...prev, newSymbol.toUpperCase()]);
      setNewSymbol('');
      setIsModalOpen(false);
      fetchStockData();
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setSelectedSymbols(prev => prev.filter(s => s !== symbol));
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl p-4 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex gap-2">
            {selectedSymbols.map(sym => (
              <div key={sym} className="flex items-center bg-gray-100 dark:bg-navy-700 px-2 py-1 rounded-lg">
                <span className="text-sm font-medium">{sym}</span>
                <button
                  onClick={() => handleRemoveSymbol(sym)}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 bg-teal-600 text-white rounded-lg text-sm"
          >
            + Add
          </button>
        </div>
        <button 
          onClick={fetchStockData}
          className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full"
        >
          <RefreshCw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Add Symbol Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-medium mb-4">Add Stock Symbol</h3>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              placeholder="Enter symbol (e.g., NVDA)"
              className="w-full p-2 border rounded-lg mb-4 dark:bg-navy-700 dark:border-navy-600"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSymbol}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2 mb-4">
        {intervals.map((int) => (
          <button
            key={int}
            onClick={() => setSelectedInterval(int)}
            className={`px-2 py-1 text-xs rounded-lg transition-colors ${
              selectedInterval === int
                ? 'bg-teal-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700'
            }`}
          >
            {int}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </div>
      ) : error ? (
        <div className="h-32 flex items-center justify-center text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: any, name: string) => [`$${value.toFixed(2)}`, name]}
              />
              {selectedSymbols.map((sym, index) => (
                <Line
                  key={sym}
                  type="monotone"
                  dataKey="price"
                  data={data.filter(d => d.symbol === sym)}
                  stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={false}
                  name={sym}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {selectedInterval} trend
        </span>
        <button 
          onClick={() => window.open(`https://finance.yahoo.com/quote/${symbols}`, '_blank')}
          className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};