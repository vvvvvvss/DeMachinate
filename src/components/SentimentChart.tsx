import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SentimentData } from '../types';
import { format } from 'date-fns';

interface SentimentChartProps {
  data: SentimentData[];
}

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'MMM dd')
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Analysis Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="dateFormatted" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis 
              domain={[-1, 1]}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: string) => [
                value.toFixed(3),
                name === 'tweetSentiment' ? 'Social Media Sentiment' : 'News Sentiment'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="newsSentiment" 
              stroke="#F59E0B"  // Orange for News 
              strokeWidth={2}
              name="News Sentiment"
              dot={false}
              activeDot={{ r: 4, fill: '#F59E0B' }}
            />
            <Line 
              type="monotone" 
              dataKey="tweetSentiment" 
              stroke="#8B5CF6"  // Purple for Social Media
              strokeWidth={2}
              name="Social Media Sentiment"
              dot={false}
              activeDot={{ r: 4, fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};