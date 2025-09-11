import React, { useState, useRef, useEffect, useMemo } from 'react';
import { TrendingUp, Moon, Sun, User, Bell, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserType } from '../../types';
import { useStockAlerts } from '../../contexts/StockAlertContext';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: string;
  type: 'manipulation' | 'volatility' | 'security';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { alerts: initialAlerts } = useStockAlerts();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const alertsRef = useRef<HTMLDivElement>(null);

  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case UserType.BEGINNER: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case UserType.INVESTOR: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case UserType.DAY_TRADER: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setShowAlerts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowAlerts(!showAlerts);
  };

  // Get actual unread alerts count
  const unreadCount = useMemo(() => 
    alerts.filter(alert => !alert.isRead).length,
  [alerts]);

  // Fetch alerts from your alert service
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-navy-600 to-teal-600 p-2 rounded-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Stock Manipulation Detector
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered market analysis platform
              </p>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={alertsRef}>
              <button 
                onClick={handleBellClick}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full"
                aria-label={`${unreadCount} unread alerts`}
              >
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {showAlerts && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-gray-200 dark:border-navy-600 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-navy-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
                    <button 
                      onClick={() => setShowAlerts(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No new alerts
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-navy-700">
                        {alerts.slice(0, 5).map((alert) => (
                          <div 
                            key={alert.id} 
                            className="p-4 hover:bg-gray-50 dark:hover:bg-navy-700 cursor-pointer"
                            onClick={() => navigate('/alerts')}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {alert.stockSymbol}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {alert.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {!alert.isRead && (
                                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {alerts.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-navy-700">
                      <button 
                        onClick={() => {
                          navigate('/alerts');
                          setShowAlerts(false);
                        }}
                        className="w-full text-center text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                      >
                        {/* View All Alerts */}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-navy-600 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                    <p className={`text-xs px-2 py-1 rounded-full ${getUserTypeColor(user.userType)}`}>
                      {user.userType}
                    </p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-800 rounded-lg shadow-lg border border-gray-200 dark:border-navy-600 z-50">
                    <div className="py-1">
                      {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700">
                        Profile Settings
                      </button> */}
                      {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700">
                        Subscription: {user.subscriptionTier}
                      </button> */}
                      <hr className="my-1 border-gray-200 dark:border-navy-600" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-navy-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};