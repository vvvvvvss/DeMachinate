import React, { useState } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  timestamp: string;
}

export const NewsFeedWidget: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      title: "Tech Giant Announces Major Innovation",
      url: "https://example.com/news1",
      source: "TechCrunch",
      timestamp: "2 hours ago"
    },
    // More news items...
  ]);

  const handleRefresh = async () => {
    // Implement actual news fetching logic
    // This could be an API call to a news service
    console.log("Refreshing news feed");
  };

  const handleNewsClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-900 dark:text-white">Latest News</h4>
        <button 
          onClick={handleRefresh}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {newsItems.map((item, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-navy-700 p-2 rounded-lg cursor-pointer"
            onClick={() => handleNewsClick(item.url)}
          >
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-gray-500">{item.source} • {item.timestamp}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </div>
        ))}
      </div>
    </div>
  );
};