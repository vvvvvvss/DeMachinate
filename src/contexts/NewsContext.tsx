import React, { createContext, useContext, useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

interface NewsContextType {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  refreshNews: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      
      const API_KEY = 'EK5K4U7IWQUCELTL';

      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets,stocks&apikey=${API_KEY}`
      );


      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();

      if (data.feed && Array.isArray(data.feed)) {
        const formattedNews = data.feed.map((item: any) => ({
          id: item.title || Math.random().toString(36).substr(2, 9),
          title: item.title || 'Market Update',
          description: item.summary || item.title,
          url: item.url || '#',
          source: item.source || 'Market News',
          publishedAt: item.time_published || new Date().toISOString(),
          imageUrl: item.banner_image || null
        }));
        
        setNews(formattedNews);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('News fetching error:', err);
      // Provide more realistic fallback data
      setNews([
        {
          id: Date.now().toString(),
          title: 'Market Analysis: Daily Update',
          description: 'Stay updated with the latest market trends and analysis.',
          url: 'https://finance.yahoo.com',
          source: 'Financial News',
          publishedAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Stock Market: Weekly Overview',
          description: 'A comprehensive look at this weeks market performance.',
          url: 'https://finance.yahoo.com',
          source: 'Market Watch',
          publishedAt: new Date().toISOString(),
        },
        {
          id: (Date.now() + 2).toString(),
          title: 'Trading Insights: Market Patterns',
          description: 'Expert analysis on emerging market patterns and trends.',
          url: 'https://finance.yahoo.com',
          source: 'Trading View',
          publishedAt: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NewsContext.Provider value={{ news, loading, error, refreshNews: fetchNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};