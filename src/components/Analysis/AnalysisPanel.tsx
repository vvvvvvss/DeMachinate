import React, { useState } from 'react';
import { Play, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SubscriptionTier } from '../../types';

interface AnalysisPanelProps {
  onAnalyze: (ticker: string, lookbackDays: number, options: any) => void;
  isAnalyzing: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ onAnalyze, isAnalyzing }) => {
  const { user } = useAuth();
  const [ticker, setTicker] = useState('AAPL');
  const [lookbackDays, setLookbackDays] = useState(90);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sensitivity, setSensitivity] = useState('Medium');
  const [dataSources, setDataSources] = useState(['Stock Price', 'Trading Volume', 'Social Media', 'News Articles']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(ticker, lookbackDays, {
      sensitivity,
      dataSources
    });
  };

  const isPremiumUser = user?.subscriptionTier === SubscriptionTier.PREMIUM || user?.subscriptionTier === SubscriptionTier.ENTERPRISE;

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-600 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
          <Settings className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Parameters</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Configure your market manipulation analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ticker Input */}
          <div>
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock Ticker Symbol
            </label>
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg 
                       bg-white dark:bg-navy-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              placeholder="e.g., AAPL, TSLA, GOOGL"
              disabled={isAnalyzing}
              required
            />
          </div>

          {/* Lookback Period */}
          <div>
            <label htmlFor="lookback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Analysis Period
            </label>
            <select
              id="lookback"
              value={lookbackDays}
              onChange={(e) => setLookbackDays(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg 
                       bg-white dark:bg-navy-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              disabled={isAnalyzing}
            >
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
              <option value={180}>180 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>

          {/* Run Analysis Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isAnalyzing || !ticker.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-navy-600 to-teal-600 text-white font-medium rounded-lg
                       hover:from-navy-700 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};