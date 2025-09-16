import React, { useState, useEffect } from 'react';
import { Plus, Layout, Save } from 'lucide-react';
import { DashboardWidget } from './DashboardWidget';
import { UserType, WidgetType } from './types/types';
import { useAuth } from '../../contexts/AuthContext';
import { WatchlistWidget } from './widgets/WatchlistWidget';
import { AlertsWidget } from './widgets/AlertsWidget';
import { NewsWidget } from './widgets/NewsWidget';
import { MetricsWidget } from './widgets/MetricsWidget';
import { ChartWidget } from './widgets/ChartWidget';



export const ModularDashboard: React.FC = () => {
  const { user } = useAuth();
  const [widgets, setWidgets] = useState<WidgetType[]>([]);
  const [showAddWidget, setShowAddWidget] = useState(false);

  // Preset configurations based on user type
  const getPresetWidgets = (userType: UserType): WidgetType[] => {
    const baseWidgets = [
      {
        id: '1',
        type: 'metrics' as const,
        title: 'Market Overview',
        size: 'medium' as const,
        position: { x: 0, y: 0 }
      }
    ];

    switch (userType) {
      case UserType.BEGINNER:
        return [
          ...baseWidgets,
          {
            id: '2',
            type: 'watchlist' as const,
            title: 'My Watchlist',
            size: 'medium' as const,
            position: { x: 2, y: 0 }
          },
          {
            id: '3',
            type: 'news' as const,
            title: 'Market News',
            size: 'large' as const,
            position: { x: 0, y: 1 }
          }
        ];

      case UserType.INVESTOR:
        return [
          ...baseWidgets,
          {
            id: '2',
            type: 'chart' as const,
            title: 'Portfolio Performance',
            size: 'large' as const,
            position: { x: 2, y: 0 }
          },
          {
            id: '3',
            type: 'alerts' as const,
            title: 'Risk Alerts',
            size: 'medium' as const,
            position: { x: 0, y: 1 }
          },
          {
            id: '4',
            type: 'news' as const,
            title: 'Financial News',
            size: 'medium' as const,
            position: { x: 2, y: 1 }
          }
        ];

      case UserType.DAY_TRADER:
        return [
          ...baseWidgets,
          {
            id: '2',
            type: 'chart' as const,
            title: 'Real-time Charts',
            size: 'large' as const,
            position: { x: 2, y: 0 }
          },
          {
            id: '3',
            type: 'alerts' as const,
            title: 'Trading Alerts',
            size: 'small' as const,
            position: { x: 0, y: 1 }
          },
          {
            id: '4',
            type: 'watchlist' as const,
            title: 'Active Positions',
            size: 'small' as const,
            position: { x: 1, y: 1 }
          },
          {
            id: '5',
            type: 'metrics' as const,
            title: 'Trading Metrics',
            size: 'medium' as const,
            position: { x: 2, y: 1 }
          }
        ];

      default:
        return baseWidgets;
    }
  };

  useEffect(() => {
    if (user) {
      // Load saved layout or use preset
      const savedLayout = localStorage.getItem(`dashboard_${user.id}`);
      if (savedLayout) {
        setWidgets(JSON.parse(savedLayout));
      } else {
        setWidgets(getPresetWidgets(user.userType));
      }
    }
  }, [user]);

  const addWidget = (type: WidgetType['type'], title: string, size: WidgetType['size']) => {
    const newWidget: WidgetType = {
      id: Date.now().toString(),
      type,
      title,
      size,
      position: { x: 0, y: widgets.length }
    };
    setWidgets([...widgets, newWidget]);
    setShowAddWidget(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const moveWidget = (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
    // Simple implementation - in a real app, you'd use a proper grid system
    setWidgets(widgets.map(w => {
      if (w.id === id) {
        const newPosition = { ...w.position };
        switch (direction) {
          case 'up': newPosition.y = Math.max(0, newPosition.y - 1); break;
          case 'down': newPosition.y = newPosition.y + 1; break;
          case 'left': newPosition.x = Math.max(0, newPosition.x - 1); break;
          case 'right': newPosition.x = newPosition.x + 1; break;
        }
        return { ...w, position: newPosition };
      }
      return w;
    }));
  };

  const saveLayout = () => {
    if (user) {
      localStorage.setItem(`dashboard_${user.id}`, JSON.stringify(widgets));
    }
  };

  const resetToPreset = () => {
    if (user) {
      setWidgets(getPresetWidgets(user.userType));
    }
  };

  const renderWidget = (widget: WidgetType) => {
    const widgetContent = () => {
      switch (widget.type) {
        case 'watchlist':
          return <WatchlistWidget />;
        case 'alerts':
          return <AlertsWidget />;
        case 'news':
          return <NewsWidget />;
        case 'metrics':
          return <MetricsWidget />;
        case 'chart':
          return <ChartWidget />;
        default:
          return <div>Widget type not implemented</div>;
      }
    };

    return (
      <DashboardWidget
        key={widget.id}
        widget={widget}
        onRemove={removeWidget}
        onMove={moveWidget}
      >
        {widgetContent()}
      </DashboardWidget>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.userType} Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your workspace with modular widgets
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddWidget(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Widget</span>
          </button>
          
          <button
            onClick={saveLayout}
            className="flex items-center space-x-2 px-4 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Layout</span>
          </button>
          
          <button
            onClick={resetToPreset}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-navy-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
          >
            <Layout className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Widget</h3>
            
            <div className="space-y-4">
              {[
                { type: 'watchlist', title: 'Watchlist', description: 'Track your favorite stocks' },
                { type: 'alerts', title: 'Alerts', description: 'Real-time notifications' },
                { type: 'news', title: 'News Feed', description: 'Latest market news' },
                { type: 'metrics', title: 'Metrics', description: 'Key performance indicators' },
                { type: 'chart', title: 'Chart', description: 'Interactive price charts' }
              ].map((widgetOption) => (
                <button
                  key={widgetOption.type}
                  onClick={() => addWidget(widgetOption.type as WidgetType['type'], widgetOption.title, 'medium')}
                  className="w-full text-left p-3 border border-gray-200 dark:border-navy-600 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{widgetOption.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{widgetOption.description}</p>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddWidget(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-4 gap-6 auto-rows-min">
        {widgets.map(renderWidget)}
      </div>

      {/* Empty State */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <Layout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No widgets configured
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add widgets to customize your dashboard experience
          </p>
          <button
            onClick={() => setShowAddWidget(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Add Your First Widget
          </button>
        </div>
      )}
    </div>
  );
};
