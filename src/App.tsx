import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NewsProvider } from './contexts/NewsContext';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginForm } from './components/Auth/LoginForm';
import { AnalysisPanel } from './components/Analysis/AnalysisPanel';
import { ModularDashboard } from './components/Dashboard/ModularDashboard';
import { CaseManagement } from './components/Cases/CaseManagement';
// import { SubscriptionManagement } from './components/Billing/SubscriptionManagement';
import { SecurityAudit } from './components/Security/SecurityAudit';
import { UserManual } from './components/UserGuide/UserManual';
import { ProgressBar } from './components/ProgressBar';
import { AnalysisSummary } from './components/AnalysisSummary';
import { StockChart } from './components/StockChart';
import { SentimentChart } from './components/SentimentChart';
import { ModelMetrics } from './components/ModelMetrics';
import { StockAnalysisService } from './services/stockApi';
import { AnalysisResults } from './types';
import { AlertProvider } from './contexts/AlertContext';
import { StockAlertProvider } from './contexts/StockAlertContext';
import { AlertsPage } from './components/alerts/AlertsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisTab, setAnalysisTab] = useState('summary');

  const handleAnalysis = async (ticker: string, lookbackDays: number, options: any) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setProgress(0);
    
    const progressSteps = [
      { progress: 10, status: `Fetching stock data for ${ticker}...` },
      { progress: 30, status: 'Processing market data...' },
      { progress: 50, status: 'Generating sentiment analysis...' },
      { progress: 70, status: 'Training anomaly detection models...' },
      { progress: 85, status: 'Analyzing manipulation patterns...' },
      { progress: 95, status: 'Generating insights...' },
      { progress: 100, status: 'Analysis complete!' }
    ];

    try {
      for (const step of progressSteps) {
        setProgress(step.progress);
        setStatus(step.status);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (step.progress === 100) {
          const analysisResults = await StockAnalysisService.analyzeStock(ticker.toUpperCase(), lookbackDays);
          setResults(analysisResults);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please check the ticker symbol and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-navy-900 dark:via-navy-800 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <LoginForm />
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'alerts':
        return <AlertsPage />;
      case 'analysis':
        return (
          <div className="space-y-6">
            <AnalysisPanel onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
            
            {isAnalyzing && (
              <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-600 p-6">
                <ProgressBar 
                  progress={progress} 
                  status={status}
                  isComplete={progress === 100}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="text-red-600 dark:text-red-400 text-xl">⚠️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Analysis Error</h3>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-gray-200 dark:border-navy-600">
                <div className="border-b border-gray-200 dark:border-navy-600">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { id: 'summary', label: 'Summary' },
                      { id: 'price', label: 'Price Analysis' },
                      { id: 'sentiment', label: 'Sentiment Analysis' },
                      { id: 'models', label: 'Model Details' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setAnalysisTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                          analysisTab === tab.id
                            ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-navy-500'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {analysisTab === 'summary' && (
                    <AnalysisSummary results={results} ticker={results.stockData[0]?.date.split('T')[0] || 'Unknown'} />
                  )}
                  {analysisTab === 'price' && (
                    <StockChart data={results.stockData} ticker={results.stockData[0]?.date.split('T')[0] || 'Unknown'} />
                  )}
                  {analysisTab === 'sentiment' && (
                    <SentimentChart data={results.sentimentData} />
                  )}
                  {analysisTab === 'models' && (
                    <ModelMetrics results={results} />
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'dashboard':
        return <ModularDashboard />;
      case 'cases':
        return <CaseManagement />;
      // case 'billing':
      //   return <SubscriptionManagement />;
      case 'security':
        return <SecurityAudit />;
      case 'manual':
        return <UserManual />;
      default:
        return <div>Tab not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <NewsProvider>
      <AlertProvider> 
    <ThemeProvider>
      <AuthProvider>
        
          <StockAlertProvider>
            <AppContent />
          </StockAlertProvider>
        </AuthProvider>
    </ThemeProvider>
    </AlertProvider>
    </NewsProvider>
  );
}

export default App;