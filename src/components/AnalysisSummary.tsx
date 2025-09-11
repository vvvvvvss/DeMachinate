import React from 'react';
import { AnalysisResults } from '../types';
import { MetricCard } from './MetricCard';
import { AlertTriangle, TrendingUp, Calendar, Percent } from 'lucide-react';
import { format } from 'date-fns';

interface AnalysisSummaryProps {
  results: AnalysisResults;
  ticker: string;
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ results, ticker }) => {
  const { summary } = results;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Analysis Results for {ticker}
        </h2>
        <p className="text-gray-600">
          Comprehensive market manipulation detection analysis
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Days Analyzed"
          value={summary.totalDays}
          icon={<Calendar />}
          color="blue"
        />
        <MetricCard
          title="Manipulation Detected"
          value={`${summary.manipulationDays} days`}
          color={summary.manipulationDays > 5 ? 'red' : summary.manipulationDays > 2 ? 'yellow' : 'green'}
          icon={<AlertTriangle />}
        />
        <MetricCard
          title="Manipulation Rate"
          value={`${summary.manipulationPercentage.toFixed(1)}%`}
          color={summary.manipulationPercentage > 10 ? 'red' : summary.manipulationPercentage > 5 ? 'yellow' : 'green'}
          icon={<Percent />}
        />
        <MetricCard
          title="Risk Level"
          value={summary.manipulationPercentage > 15 ? 'High' : summary.manipulationPercentage > 8 ? 'Medium' : 'Low'}
          color={summary.manipulationPercentage > 15 ? 'red' : summary.manipulationPercentage > 8 ? 'yellow' : 'green'}
          icon={<TrendingUp />}
        />
      </div>

      {/* Suspicious Dates */}
      {summary.suspiciousDates.length > 0 ? (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            Dates with Suspected Manipulation
          </h3>
          <div className="space-y-4">
            {summary.suspiciousDates.slice(0, 10).map((item, index) => (
              <div key={index} className="border-l-4 border-red-200 bg-red-50 p-4 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      {getSeverityIcon(item.severity)}
                      {format(new Date(item.date), 'MMMM dd, yyyy')}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                        {item.severity.toUpperCase()}
                      </span>
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Detected anomalies:</p>
                      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        {item.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {summary.suspiciousDates.length > 10 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                ... and {summary.suspiciousDates.length - 10} more suspicious dates
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="text-green-600 text-2xl">✅</div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">No Manipulation Detected</h3>
              <p className="text-green-700">
                Our analysis didn't find any suspicious manipulation patterns in the analyzed period.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};