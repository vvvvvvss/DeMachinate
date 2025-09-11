// import React, { useState, useEffect } from 'react';
// import { TrendingUp, TrendingDown, Plus, Star } from 'lucide-react';

// interface WatchlistItem {
//   ticker: string;
//   name: string;
//   price: number;
//   change: number;
//   changePercent: number;
//   volume: string;
//   manipulationRisk: 'low' | 'medium' | 'high';
// }

// export const WatchlistWidget: React.FC = () => {
//   const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newCase, setNewCase] = useState<Omit<WatchlistItem, 'change' | 'changePercent'>>({
//     ticker: '',
//     name: '',
//     price: 0,
//     volume: '',
//     manipulationRisk: 'low'
//   });

//   useEffect(() => {
//     // Load initial watchlist from API
//     const fetchWatchlist = async () => {
//       try {
//         const response = await fetch('/api/watchlist');
//         const data = await response.json();
//         setWatchlist(data);
//       } catch (error) {
//         console.error('Error fetching watchlist:', error);
//       }
//     };
//     fetchWatchlist();
//   }, []);

//   const handleAddCase = async () => {
//     try {
//       const response = await fetch('/api/watchlist', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newCase),
//       });
      
//       if (response.ok) {
//         const addedCase = await response.json();
//         setWatchlist([...watchlist, addedCase]);
//         setShowAddForm(false);
//         setNewCase({
//           ticker: '',
//           name: '',
//           price: 0,
//           volume: '',
//           manipulationRisk: 'low'
//         });
//       }
//     } catch (error) {
//       console.error('Error adding case:', error);
//     }
//   };

//   const getRiskColor = (risk: string) => {
//     switch (risk) {
//       case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
//       case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
//       case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
//       default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h4 className="font-medium text-gray-900 dark:text-white">Your Watchlist</h4>
//         <button 
//           onClick={() => setShowAddForm(true)}
//           className="p-1 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
//         >
//           <Plus className="w-4 h-4" />
//         </button>
//       </div>

//       <div className="space-y-3">
//         {watchlist.map((item) => (
//           <div
//             key={item.ticker}
//             className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors cursor-pointer"
//           >
//             <div className="flex items-center space-x-3">
//               <button className="text-gray-400 hover:text-yellow-500 transition-colors">
//                 <Star className="w-4 h-4" />
//               </button>
//               <div>
//                 <p className="font-semibold text-gray-900 dark:text-white">{item.ticker}</p>
//                 <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-24">
//                   {item.name}
//                 </p>
//               </div>
//             </div>

//             <div className="text-right">
//               <p className="font-semibold text-gray-900 dark:text-white">
//                 ${item.price.toFixed(2)}
//               </p>
//               <div className="flex items-center space-x-1">
//                 {item.change >= 0 ? (
//                   <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
//                 ) : (
//                   <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
//                 )}
//                 <span className={`text-xs font-medium ${
//                   item.change >= 0 
//                     ? 'text-green-600 dark:text-green-400' 
//                     : 'text-red-600 dark:text-red-400'
//                 }`}>
//                   {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
//                 </span>
//               </div>
//             </div>

//             <div className="text-right">
//               <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(item.manipulationRisk)}`}>
//                 {item.manipulationRisk}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <button className="w-full py-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
//         View Full Watchlist
//       </button>
//     </div>
//   );
// };
// TradeWatch/src/components/Dashboard/widgets/WatchlistWidget.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

interface WatchlistItem {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  manipulationRisk: 'low' | 'medium' | 'high';
}

export const WatchlistWidget: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    ticker: '',
    name: '',
    price: 0,
    volume: '',
    manipulationRisk: 'low' as const
  });

  // Fetch initial watchlist (replace with actual API call)
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        // Simulated API call
        const mockWatchlist: WatchlistItem[] = [
          {
            id: '1',
            ticker: 'AAPL',
            name: 'Apple Inc.',
            price: 175.50,
            change: 2.35,
            changePercent: 1.35,
            volume: '25.3M',
            manipulationRisk: 'low'
          },
          {
            id: '2',
            ticker: 'GOOGL',
            name: 'Alphabet Inc.',
            price: 126.75,
            change: -1.20,
            changePercent: -0.95,
            volume: '15.6M',
            manipulationRisk: 'medium'
          }
        ];
        setWatchlist(mockWatchlist);
      } catch (error) {
        console.error('Failed to fetch watchlist', error);
      }
    };

    fetchWatchlist();
  }, []);

  // Add new watchlist item
  const handleAddItem = () => {
    if (!newItem.ticker || !newItem.name) {
      alert('Please fill in all required fields');
      return;
    }

    const itemToAdd: WatchlistItem = {
      id: Date.now().toString(),
      ...newItem,
      price: newItem.price,
      change: 0,
      changePercent: 0,
      volume: newItem.volume
    };

    setWatchlist(prev => [...prev, itemToAdd]);
    setNewItem({
      ticker: '',
      name: '',
      price: 0,
      volume: '',
      manipulationRisk: 'low'
    });
    setShowAddForm(false);
  };

  // Remove item from watchlist
  const handleRemoveItem = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  // Risk color mapping
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">Your Watchlist</h4>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-gray-50 dark:bg-navy-700 p-4 rounded-lg space-y-3">
          <input 
            type="text"
            placeholder="Ticker Symbol"
            value={newItem.ticker}
            onChange={(e) => setNewItem(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
            className="w-full px-3 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-600 dark:text-white"
          />
          <input 
            type="text"
            placeholder="Company Name"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-600 dark:text-white"
          />
          <input 
            type="number"
            placeholder="Current Price"
            value={newItem.price}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-600 dark:text-white"
          />
          type RiskLevel = 'low' | 'medium' | 'high';
                    <select
                      value={newItem.manipulationRisk}
                      onChange={(e) => setNewItem(prev => ({ 
                        ...prev, 
                        manipulationRisk: e.target.value as RiskLevel
                      }))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-600 dark:text-white"
                    >
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-600 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddItem}
              className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      )}

      {/* Watchlist Items */}
      <div className="space-y-3">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-navy-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.ticker}</p>
                <p className="text-xs text-gray-600 dark:text-navy-300 truncate max-w-24">
                  {item.name}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                ${item.price.toFixed(2)}
              </p>
              <div className="flex items-center space-x-1">
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                )}
                <span className={`text-xs font-medium ${
                  item.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(item.manipulationRisk)}`}>
                {item.manipulationRisk}
              </span>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {watchlist.length === 0 && (
        <p className="text-center text-gray-500 dark:text-navy-300">
          No items in watchlist. Add a stock to get started.
        </p>
      )}
    </div>
  );
};
