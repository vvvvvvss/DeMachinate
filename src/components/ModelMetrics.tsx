import React from 'react';
import { AnalysisResults } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ModelMetricsProps {
  results: AnalysisResults;
}

export const ModelMetrics: React.FC<ModelMetricsProps> = ({ results }) => {
  const { modelMetrics, stockData } = results;

  const metricsData = [
    { name: 'Precision', value: modelMetrics.precision * 100 },
    { name: 'Recall', value: modelMetrics.recall * 100 },
    { name: 'F1 Score', value: modelMetrics.f1Score * 100 }
  ];

  const anomalyDistribution = [
    { 
      name: 'Normal Days', 
      value: stockData.filter(d => !d.isAnomaly).length,
      color: '#10B981'
    },
    { 
      name: 'Anomalous Days', 
      value: stockData.filter(d => d.isAnomaly).length,
      color: '#EF4444'
    }
  ];

  const manipulationDistribution = stockData.reduce((acc, item) => {
    const probability = item.manipulationProbability;
    if (probability < 0.3) acc.low++;
    else if (probability < 0.6) acc.medium++;
    else acc.high++;
    return acc;
  }, { low: 0, medium: 0, high: 0 });

  const riskData = [
    { name: 'Low Risk', value: manipulationDistribution.low, color: '#10B981' },
    { name: 'Medium Risk', value: manipulationDistribution.medium, color: '#F59E0B' },
    { name: 'High Risk', value: manipulationDistribution.high, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Model Performance & Analysis Details
        </h2>
        <p className="text-gray-600">
          Detailed insights into detection accuracy and data distribution
        </p>
      </div>

      {/* Model Performance Metrics */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Model Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {(modelMetrics.precision * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-800 font-medium">Precision</div>
            <div className="text-xs text-blue-600 mt-1">
              Accuracy of positive predictions
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {(modelMetrics.recall * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-green-800 font-medium">Recall</div>
            <div className="text-xs text-green-600 mt-1">
              Coverage of actual positives
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {(modelMetrics.f1Score * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-800 font-medium">F1 Score</div>
            <div className="text-xs text-purple-600 mt-1">
              Balanced accuracy measure
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [`${value.toFixed(1)}%`, 'Score']}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Anomaly Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={anomalyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {anomalyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-4">
            {anomalyDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-4 space-x-4">
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Importance Simulation */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Detection Features</h3>
        <div className="space-y-4">
          {[
            { feature: 'Price Z-Score', importance: 0.28 },
            { feature: 'Volume Z-Score', importance: 0.24 },
            { feature: 'Social Sentiment', importance: 0.18 },  
            { feature: 'Volatility', importance: 0.15 },
            { feature: 'News Sentiment', importance: 0.09 },
            { feature: 'Price Momentum', importance: 0.06 }
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{item.feature}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${item.importance * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm text-gray-800 font-medium">
                {(item.importance * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};