// TradeWatch/src/components/Dashboard/widgets/NewsWidget.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { NewsService, NewsItem } from '../../../services/newsService';

export const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNews = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    
    try {
      const data = await NewsService.fetchNews();
      console.log('Fetched news data:', data); // Add this debug log
      setNews(data);
    } catch (err) {
      console.error('Error details:', err); // Add detailed error logging
      setError(err instanceof Error ? err.message : 'Failed to load news updates');
      setNews([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => fetchNews(false), 300000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNews(false);
  };

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading news...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">Market News</h4>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1 text-xs text-teal-600 dark:text-teal-400 
                     hover:text-teal-700 dark:hover:text-teal-300 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error ? (
        <div className="flex items-center space-x-2 text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          No news available at the moment
        </div>
      ) : (
        <div className="space-y-3">
          {news.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => handleNewsClick(item.url)}
              className="p-3 bg-gray-50 dark:bg-navy-700 rounded-lg 
                         hover:bg-gray-100 dark:hover:bg-navy-600 
                         transition-colors cursor-pointer group"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getSentimentDot(item.sentiment)}`} />
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white 
                               line-clamp-2 group-hover:text-teal-600 
                               dark:group-hover:text-teal-400 transition-colors">
                    {item.title}
                  </h5>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{item.source}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400 
                                          group-hover:text-teal-600 
                                          dark:group-hover:text-teal-400 
                                          transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
};

// Helper function to format timestamps
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
};

// Existing sentiment helper functions remain the same
const getSentimentDot = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'bg-green-500';
    case 'negative': return 'bg-red-500';
    case 'neutral': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};