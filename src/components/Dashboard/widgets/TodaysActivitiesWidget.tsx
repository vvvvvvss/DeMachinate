// src/components/Dashboard/widgets/TodaysActivitiesWidget.tsx
import React, { useState, useEffect } from 'react';

interface ActivityItemProps {
  label: string;
  value: number;
  color: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600 dark:text-navy-300">{label}</span>
    <span className={`font-medium ${color}`}>{value}</span>
  </div>
);

export const TodaysActivitiesWidget: React.FC = () => {
  const [activities, setActivities] = useState({
    analysesRun: 0,
    alertsGenerated: 0,
    casesCreated: 0
  });

  useEffect(() => {
    // Fetch real-time activities
    const fetchActivities = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/today-activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities', error);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4 h-full">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Today's Activity
      </h3>
      <div className="space-y-2">
        <ActivityItem 
          label="Analyses Run" 
          value={activities.analysesRun} 
          color="text-blue-600 dark:text-blue-400" 
        />
        <ActivityItem 
          label="Alerts Generated" 
          value={activities.alertsGenerated} 
          color="text-red-600 dark:text-red-400" 
        />
        <ActivityItem 
          label="Cases Created" 
          value={activities.casesCreated} 
          color="text-yellow-600 dark:text-yellow-400" 
        />
      </div>
    </div>
  );
};