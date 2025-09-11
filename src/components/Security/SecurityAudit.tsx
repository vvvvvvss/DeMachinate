import React, { useState, useEffect } from 'react';
import { Shield, Download, RefreshCw, Lock, Eye, Settings, AlertTriangle } from 'lucide-react';
import { Switch, Select } from 'antd';

class AuditService {
  static async fetchAuditTrail() {
    return [
      {
        timestamp: new Date().toISOString(),
        action: "SYSTEM_REFRESH",
        user: "admin",
        details: "Comprehensive system audit initiated",
        severity: "info"
      }
      // More audit entries
    ];
  }

  static async exportAuditTrail(data: any[]) {
    const csvContent = data.map(entry =>
      `${entry.timestamp},${entry.action},${entry.user},${entry.details}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_trail_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const SecurityAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState< 'api' | 'audit'>('api');
  const [auditData, setAuditData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAuditTrail = async () => {
    setIsLoading(true);
    try {
      const newAuditData = await AuditService.fetchAuditTrail();
      setAuditData(newAuditData);
    } catch (error) {
      console.error("Failed to refresh audit trail", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditTrail = async () => {
    await AuditService.exportAuditTrail(auditData);
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      refreshAuditTrail();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'api'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-navy-600'
          }`}
        >
          API Keys
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === 'audit'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-navy-600'
          }`}
        >
          Security & Audit Trail
        </button>
      </div>


      {activeTab === 'api' && (
        <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Production API Key</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Used for production applications</p>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                    sk_prod_••••••••••••••••••••••••••••••••
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                    Revoke
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Development API Key</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Used for testing and development</p>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                    sk_dev_••••••••••••••••••••••••••••••••
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                    Revoke
                  </button>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-navy-600 text-gray-600 dark:text-gray-400 rounded-lg hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                + Generate New API Key
              </button>

              <div className="space-y-6">
                {/* API Usage Metrics */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">API Usage Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-600">Total Requests</h4>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-600">Active Keys</h4>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-600">Failed Requests</h4>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </div>

                {/* API Rate Limiting */}
                <div className="bg-white dark:bg-navy-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">API Rate Limiting</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Limit the number of requests per minute
                      </p>
                    </div>
                    <div>
                      <Select
                        defaultValue="100"
                        style={{ width: 120 }}
                        options={[
                          { value: '50', label: '50 requests/min' },
                          { value: '100', label: '100 requests/min' },
                          { value: '200', label: '200 requests/min' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Keep your API keys secure and never share them publicly. Rotate keys regularly for enhanced security.
                  </p>
                </div>
              </div>
            </div>
          </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Security & Audit Trail
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={refreshAuditTrail}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2
                  bg-gray-100 dark:bg-navy-700
                  text-gray-700 dark:text-white
                  rounded-lg hover:bg-gray-200 dark:hover:bg-navy-600
                  disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportAuditTrail}
                className="flex items-center space-x-2 px-4 py-2
                  bg-teal-600 text-white
                  rounded-lg hover:bg-teal-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-navy-700">
                  <th className="px-4 py-3 text-left">Timestamp</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {auditData.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-navy-700
                      hover:bg-gray-50 dark:hover:bg-navy-700"
                  >
                    <td className="px-4 py-3">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{entry.action}</td>
                    <td className="px-4 py-3">{entry.user}</td>
                    <td className="px-4 py-3">{entry.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const PrivacySettings: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState({
    twoFactorAuth: false,
    dataRetention: '90',
    sensitivityLevel: 'Internal',
    analyticsSharing: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePrivacySettings = () => {
    // Implement actual save logic
    console.log('Saving Privacy Settings:', privacySettings);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-navy-800 p-6 rounded-xl">
      <h2 className="text-2xl font-bold dark:text-white">Privacy Settings</h2>

      {/* Two-Factor Authentication */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium dark:text-white">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600 dark:text-navy-300">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch
          checked={privacySettings.twoFactorAuth}
          onChange={(checked: boolean) => handleSettingChange('twoFactorAuth', checked)}
        />
      </div>

      {/* Data Retention */}
      <div>
        <label className="block text-sm font-medium dark:text-white">
          Data Retention Period
        </label>
        <Select
          value={privacySettings.dataRetention}
          onChange={(value: string) => handleSettingChange('dataRetention', value)}
          options={[
            { value: '30', label: '30 days' },
            { value: '90', label: '90 days' },
            { value: '365', label: '1 year' }
          ]}
        />
      </div>

      <div className="space-y-6">
        {/* Data Protection Settings */}
        <div className="bg-white dark:bg-navy-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Data Protection</h3>
          <div className="space-y-4">
            {/* Cookie Preferences */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Cookie Preferences</h4>
                <p className="text-sm text-gray-600">Manage website cookie settings</p>
              </div>
              <Switch defaultChecked onChange={(checked) => handleSettingChange('cookies', checked)} />
            </div>

            {/* Data Encryption */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">End-to-End Encryption</h4>
                <p className="text-sm text-gray-600">Enable advanced data encryption</p>
              </div>
              <Switch onChange={(checked) => handleSettingChange('encryption', checked)} />
            </div>

            {/* Data Export */}
            <div className="mt-4">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg">
                Export Personal Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={savePrivacySettings}
        className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
      >
        Save Privacy Settings
      </button>
    </div>
  );
};
