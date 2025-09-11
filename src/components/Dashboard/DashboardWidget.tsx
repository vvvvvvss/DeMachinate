import React from 'react';
import { X, Move, MoreVertical } from 'lucide-react';
import { DashboardWidget as WidgetType } from '../../types';

interface DashboardWidgetProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  children: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  widget,
  onRemove,
  onMove,
  children
}) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-1';
      case 'large': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className={`bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-600 ${getSizeClasses(widget.size)}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-navy-600">
        <h3 className="font-semibold text-gray-900 dark:text-white">{widget.title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove(widget.id, 'up')}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Move widget"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Remove widget"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};