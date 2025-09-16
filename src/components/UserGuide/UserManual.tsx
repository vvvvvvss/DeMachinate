import React, { useState } from 'react';
import { BookOpen, Play, Users, TrendingUp, Shield, CreditCard, Lock, Key, History, CheckCircle } from 'lucide-react';
import { UserType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const UserManual: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Play },
    { id: 'user-types', label: 'User Types', icon: Users },
    { id: 'analysis', label: 'Running Analysis', icon: TrendingUp },
    { id: 'security', label: 'Security Features', icon: Shield },
    // { id: 'billing', label: 'Billing & Plans', icon: CreditCard }
  ];

  const getUserTypeInfo = (userType: UserType) => {
    switch (userType) {
      case UserType.BEGINNER:
        return {
          title: 'Beginner Investor',
          description: 'New to stock market analysis and manipulation detection',
          features: [
            'Simplified dashboard with essential widgets',
            'Educational tooltips and guided tours',
            'Basic analysis with clear explanations',
            'Curated news feed with market insights',
            'Risk indicators with plain language descriptions'
          ],
          tips: [
            'Start with well-known stocks like AAPL or MSFT',
            'Use the 30-day analysis period to begin with',
            'Pay attention to the risk indicators and their explanations',
            'Read the news feed to understand market context'
          ]
        };
      case UserType.INVESTOR:
        return {
          title: 'Professional Investor',
          description: 'Experienced investor focused on long-term analysis',
          features: [
            'Comprehensive dashboard with portfolio tracking',
            'Advanced analytics and correlation analysis',
            'Historical trend analysis and backtesting',
            'Risk assessment and portfolio optimization',
            'Detailed reporting and export capabilities'
          ],
          tips: [
            'Use longer analysis periods (90-365 days) for trend analysis',
            'Monitor correlation between sentiment and price movements',
            'Set up alerts for your portfolio holdings',
            'Use case management to track investigations'
          ]
        };
      case UserType.DAY_TRADER:
        return {
          title: 'Day Trader',
          description: 'Active trader requiring real-time analysis and alerts',
          features: [
            'Real-time charts and live data feeds',
            'High-frequency alert system',
            'Quick analysis tools and hotkeys',
            'Trading volume and momentum indicators',
            'Fast execution and minimal latency'
          ],
          tips: [
            'Use shorter analysis periods (30-60 days) for recent patterns',
            'Enable real-time alerts for immediate notifications',
            'Monitor volume anomalies for trading opportunities',
            'Use the high sensitivity setting for early detection'
          ]
        };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Manual
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Complete guide to using the Stock Manipulation Detection System
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-600 p-8">
            {activeSection === 'getting-started' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Started</h3>
                
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Welcome to the Stock Manipulation Detection System. This guide will help you get started with analyzing potential market manipulation.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Quick Start Steps</h4>
                  <ol className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                      <div>
                        <strong>Login to your account</strong> using the credentials provided in the sidebar
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                      <div>
                        <strong>Enter a stock ticker symbol</strong> (e.g., AAPL, MSFT, TSLA) in the Analysis tab
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                      <div>
                        <strong>Set the analysis period</strong> using the dropdown (start with 90 days)
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                      <div>
                        <strong>Click "Run Analysis"</strong> and wait for the results
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
                      <div>
                        <strong>Review the results</strong> in the different tabs (Summary, Charts, etc.)
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Pro Tip</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Start with well-known stocks like Apple (AAPL) or Microsoft (MSFT) to familiarize yourself with the system before analyzing smaller or more volatile stocks.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'user-types' && user && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">User Types & Customization</h3>
                
                {(() => {
                  const userInfo = getUserTypeInfo(user.userType);
                  if (!userInfo) return null;
                  
                  return (
                    <div className="space-y-6">
                      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-teal-900 dark:text-teal-100 mb-2">
                          Your Profile: {userInfo.title}
                        </h4>
                        <p className="text-teal-800 dark:text-teal-200">{userInfo.description}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Features Optimized for You</h4>
                        <ul className="space-y-2">
                          {userInfo.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended Best Practices</h4>
                        <ul className="space-y-2">
                          {userInfo.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-teal-600 dark:text-teal-400 mt-1">→</span>
                              <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeSection === 'analysis' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Running Analysis</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Understanding the Analysis Process</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Our AI system analyzes multiple data sources to detect potential market manipulation:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📈 Price & Volume Analysis</h5>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Identifies unusual market behavior using statistical anomaly detection and z-score analysis
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">💭 Sentiment Analysis</h5>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          Analyzes social media and news sentiment to detect coordinated campaigns
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">🤖 Machine Learning</h5>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Uses Isolation Forest and XGBoost to identify suspicious patterns
                        </p>
                      </div>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">📊 Correlation Analysis</h5>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Detects unusual relationships between sentiment and price movements
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Interpreting Results</h4>
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4">
                        <h5 className="font-semibold text-green-900 dark:text-green-100">Low Risk (0-30%)</h5>
                        <p className="text-sm text-green-800 dark:text-green-200">Normal market behavior with no significant anomalies detected.</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4">
                        <h5 className="font-semibold text-yellow-900 dark:text-yellow-100">Medium Risk (30-70%)</h5>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">Some unusual patterns detected that warrant further investigation.</p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
                        <h5 className="font-semibold text-red-900 dark:text-red-100">High Risk (70%+)</h5>
                        <p className="text-sm text-red-800 dark:text-red-200">Strong indicators of potential manipulation requiring immediate attention.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Security Features</h3>
                
                <div className="grid gap-6">
                  {/* Two-Factor Authentication */}
                  <div className="bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Add an extra layer of security to your account by enabling 2FA.
                    </p>
                    <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4 space-y-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">Setup Steps:</h5>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        <li>Go to Security Settings in your profile</li>
                        <li>Click "Enable 2FA"</li>
                        <li>Scan the QR code with your authenticator app</li>
                        <li>Enter the verification code to complete setup</li>
                      </ol>
                    </div>
                  </div>

                  {/* API Security */}
                  <div className="bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Key className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                      API Security
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Best practices for managing your API keys and access tokens.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Important Security Tips</h5>
                        <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200">
                          <li>Never share your API keys</li>
                          <li>Rotate keys every 90 days</li>
                          <li>Use separate keys for development and production</li>
                          <li>Monitor API usage regularly</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail */}
                  <div className="bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <History className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                      Audit Trail
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Track all security-related actions and system events.
                    </p>
                    <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">Available Logs:</h5>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Login attempts',
                          'API key usage',
                          'Permission changes',
                          'Analysis runs',
                          'Alert triggers',
                          'Data exports'
                        ].map((item, index) => (
                          <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Data Protection */}
                  {/* <div className="bg-white dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                      Data Protection
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Our commitment to protecting your data and analysis results.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-navy-800 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Data Encryption</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          All data is encrypted at rest and in transit using industry-standard protocols.
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-navy-800 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Data Retention</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Analysis results are retained according to your subscription settings.
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* Add other sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};