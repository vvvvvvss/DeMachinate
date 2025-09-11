// import React from 'react';
// import { 
//   BarChart3, 
//   Search, 
//   FileText, 
//   CreditCard, 
//   Shield, 
//   BookOpen,
//   TrendingUp,
//   AlertTriangle,
//   Settings,
//   Users
// } from 'lucide-react';

// interface SidebarProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
//   const menuItems = [
//     { id: 'analysis', label: 'Analysis', icon: Search, description: 'Run stock analysis' },
//     { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Real-time monitoring' },
//     { id: 'cases', label: 'Case Management', icon: FileText, description: 'Investigation tracking' },
//     // { id: 'billing', label: 'Subscription', icon: CreditCard, description: 'Billing & plans' },
//     { id: 'security', label: 'Security', icon: Shield, description: 'Audit & privacy' },
//     { id: 'manual', label: 'User Guide', icon: BookOpen, description: 'Help & documentation' }
//   ];

//   return (
//     <aside className="w-64 bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-navy-700 h-full">
//       <div className="p-6">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
//           Control Panel
//         </h2>
        
//         <nav className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = activeTab === item.id;
            
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => onTabChange(item.id)}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
//                   isActive
//                     ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-l-4 border-teal-500'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800'
//                 }`}
//               >
//                 <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`} />
//                 <div>
//                   <p className="font-medium">{item.label}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </nav>

        {/* Quick Stats */}
        {/* <div className="mt-8 p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Today's Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400"></span>
              <span className="font-medium text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400"></span>
              <span className="font-medium text-red-600 dark:text-red-400">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400"></span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">1</span>
            </div>
          </div>
        </div> */}
//       </div>
//     </aside>
//   );
// };
import React from 'react';
import { 
  BarChart3, 
  Search, 
  FileText, 
  Shield, 
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-white dark:bg-navy-800 border-r border-gray-200 dark:border-navy-700">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Control Panel
        </h2>
        
        <nav className="space-y-1">
          {[
            {
              id: 'analysis',
              label: 'Analysis',
              subtitle: 'Run stock analysis',
              icon: Search
            },
            {
              id: 'dashboard',
              label: 'Dashboard', 
              subtitle: 'Real-time monitoring',
              icon: BarChart3
            },
            {
              id: 'cases',
              label: 'Case Management',
              subtitle: 'Investigation tracking',
              icon: FileText
            },
            {
              id: 'security',
              label: 'Security',
              subtitle: 'Audit & privacy',
              icon: Shield
            },
            {
              id: 'manual',
              label: 'User Guide',
              subtitle: 'Help & documentation',
              icon: BookOpen
            }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-start p-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-teal-50 dark:bg-navy-600 text-teal-600 dark:text-teal-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3 mt-0.5" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
