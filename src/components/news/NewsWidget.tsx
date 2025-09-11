import React, { useState } from 'react';
import { ExternalLink, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { useNews } from '../../contexts/NewsContext';

export const NewsWidget: React.FC = () => {
  const { news, loading, error, refreshNews } = useNews();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const startIndex = currentPage * itemsPerPage;
  const displayedNews = news.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(news.length / itemsPerPage);

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-navy-800 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-navy-600 rounded w-1/4 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 dark:bg-navy-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-navy-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-navy-800 rounded-lg shadow-sm">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-lg shadow-sm">
      <div className="p-4 border-b dark:border-navy-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-white">Market News</h3>
        <button 
          onClick={refreshNews}
          className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="divide-y dark:divide-navy-700">
        {displayedNews.map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
            <a 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-navy-300 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-navy-400">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{new Date(item.publishedAt).toLocaleString()}</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </div>
                </div>
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded ml-4"
                  />
                )}
              </div>
            </a>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t dark:border-navy-700 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 dark:text-navy-300">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};