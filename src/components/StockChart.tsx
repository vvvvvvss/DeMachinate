import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { StockData } from '../types';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

interface StockChartProps {
  data: StockData[];
  ticker: string;
}

export const StockChart: React.FC<StockChartProps> = ({ data, ticker }) => {
  const { theme } = useTheme();

  const processedData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return sortedData.map((item, index) => {
      const movingAverage5 = calculateMovingAverage(sortedData, index, 5);
      const movingAverage20 = calculateMovingAverage(sortedData, index, 20);
      
      return {
        ...item,
        date: format(new Date(item.date), 'MMM dd'),
        movingAverage5,
        movingAverage20,
        percentageChange: calculatePercentageChange(sortedData, index)
      };
    });
  }, [data]);

  const latestPrice = processedData[processedData.length - 1]?.close || 0;
  const percentageChange = processedData[processedData.length - 1]?.percentageChange || 0;

  // Determine color scheme based on theme
  const gridColor = theme === 'dark' ? '#374151' : '#e0e0e0';
  const axisColor = theme === 'dark' ? '#6B7280' : '#666';
  const backgroundColor = theme === 'dark' ? '#1F2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#F9FAFB' : '#111827';

  return (
    <div 
      className={`rounded-xl shadow-lg p-6 ${
        theme === 'dark' ? 'bg-navy-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {ticker} Stock Price Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${latestPrice.toFixed(2)}</span>
            <span className={`text-sm font-medium ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentageChange >= 0 ? '▲' : '▼'} {Math.abs(percentageChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart 
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={gridColor} 
            fill={backgroundColor}
          />
          <XAxis 
            dataKey="date" 
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
          />
          <YAxis 
            domain={['dataMin - 10', 'dataMax + 10']} 
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            tick={{ fill: axisColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#374151' : '#fff',
              border: `1px solid ${theme === 'dark' ? '#4B5563' : '#ccc'}`,
              color: textColor
            }}
            formatter={(value, name) => [
              typeof value === 'number' ? `$${value.toFixed(2)}` : value, 
              name
            ]}
          />
          <Legend 
            wrapperStyle={{ color: textColor }}
            iconType="circle"
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3B82F6" 
            strokeWidth={2} 
            name="Closing Price" 
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="movingAverage5" 
            stroke="#10B981" 
            strokeWidth={2} 
            name="5-day Moving Average" 
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="movingAverage20" 
            stroke="#F43F5E" 
            strokeWidth={2} 
            name="20-day Moving Average" 
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function calculateMovingAverage(data: StockData[], currentIndex: number, period: number): number {
  const start = Math.max(0, currentIndex - period + 1);
  const end = currentIndex + 1;
  const slice = data.slice(start, end);
  
  if (slice.length === 0) return 0;
  
  const sum = slice.reduce((acc, item) => acc + item.close, 0);
  return sum / slice.length;
}

function calculatePercentageChange(data: StockData[], currentIndex: number): number {
  if (currentIndex < 1) return 0;
  
  const currentPrice = data[currentIndex].close;
  const previousPrice = data[currentIndex - 1].close;
  
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}
