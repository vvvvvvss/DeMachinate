// src/components/Cases/CaseManagement.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Edit, 
  Eye, 
  Trash2 
} from 'lucide-react';
import { Case, CaseStatus, CasePriority, CaseType } from '../../types';

export const CaseManagement: React.FC = () => {
  // Initial cases with more comprehensive data
  const [cases, setCases] = useState<Case[]>([
    {
      id: 'CASE-001',
      ticker: 'AAPL',
      status: CaseStatus.OPEN,
      priority: CasePriority.HIGH,
      type: CaseType.PUMP_AND_DUMP,
      created: new Date().toISOString(),
      description: 'Unusual trading pattern detected',
      assignedTo: 'John Doe',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'CASE-002',
      ticker: 'GOOGL',
      status: CaseStatus.IN_PROGRESS,
      priority: CasePriority.MEDIUM,
      type: CaseType.INSIDER_TRADING,
      created: new Date().toISOString(),
      description: 'Suspicious insider movement',
      assignedTo: 'Jane Smith',
      lastUpdated: new Date().toISOString()
    }
  ]);

  // State for filters and search
  type FiltersType = {
    status: CaseStatus[],
    priority: CasePriority[],
    type: CaseType[]
  };
  const [filters, setFilters] = useState<FiltersType>({
    status: [],
    priority: [],
    type: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // New case state
  const [newCase, setNewCase] = useState<Partial<Case>>({
    ticker: '',
    description: '',
    type: CaseType.PUMP_AND_DUMP,
    priority: CasePriority.MEDIUM
  });

  // Filtered and searched cases
  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = 
        caseItem.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatusFilter = 
        filters.status.length === 0 || 
        filters.status.includes(caseItem.status);

      const matchesPriorityFilter = 
        filters.priority.length === 0 || 
        filters.priority.includes(caseItem.priority);

      const matchesTypeFilter = 
        filters.type.length === 0 || 
        filters.type.includes(caseItem.type);

      return matchesSearch && 
             matchesStatusFilter && 
             matchesPriorityFilter && 
             matchesTypeFilter;
    });
  }, [cases, searchTerm, filters]);

  // Create case handler
  const handleCreateCase = () => {
    if (!newCase.ticker || !newCase.description) {
      alert('Please fill all required fields');
      return;
    }

    const caseToAdd: Case = {
      ...newCase as Case,
      id: `CASE-${cases.length + 1}`,
      status: CaseStatus.OPEN,
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      assignedTo: 'Current User'
    };

    setCases(prevCases => [...prevCases, caseToAdd]);
    resetCreateModal();
  };

  // Edit case handler
  const handleUpdateCase = () => {
    if (!selectedCase) return;

    setCases(prevCases => 
      prevCases.map(c => 
        c.id === selectedCase.id 
          ? { 
              ...selectedCase, 
              lastUpdated: new Date().toISOString() 
            } 
          : c
      )
    );
    resetEditModal();
  };

  // Delete case handler
  const handleDeleteCase = (caseId: string) => {
    setCases(prevCases => prevCases.filter(c => c.id !== caseId));
  };

  // Filter toggle handler
  const toggleFilter = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(f => f !== value)
        : [...prev[filterType], value]
    }));
  };

  // Reset create modal
  const resetCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewCase({
      ticker: '',
      description: '',
      type: CaseType.PUMP_AND_DUMP,
      priority: CasePriority.MEDIUM
    });
  };

  // Reset edit modal
  const resetEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCase(null);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-navy-900 p-6 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Case Management
        </h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Case</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-grow">
          <input 
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-700 dark:text-white"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 border rounded-lg flex items-center space-x-2 dark:bg-navy-800 dark:border-navy-700"
          >
            <Filter className="w-4 h-4" />
            <span className="dark:text-white">Filters</span>
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-800 border rounded-lg shadow-lg p-4 z-50">
              {/* Filter options */}
              {Object.entries({
                status: Object.values(CaseStatus),
                priority: Object.values(CasePriority),
                type: Object.values(CaseType)
              }).map(([filterType, values]) => (
                <div key={filterType} className="mb-4">
                  <h4 className="font-semibold mb-2 dark:text-white capitalize">
                    {filterType}
                  </h4>
                  <div className="space-y-2">
                    {values.map((value) => (
                      <label 
                        key={value} 
                        className="flex items-center space-x-2"
                      >
                        <input 
                          type="checkbox"
                          checked={filters[filterType as keyof typeof filters].includes(value)}
                          onChange={() => toggleFilter(filterType as keyof typeof filters, value)}
                          className="dark:bg-navy-700"
                        />
                        <span className="dark:text-white">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.map((caseItem) => (
          <div 
            key={caseItem.id} 
            className="bg-gray-50 dark:bg-navy-800 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold dark:text-white">
                  {caseItem.id}
                </span>
                <span className="text-sm text-gray-500 dark:text-navy-300">
                  {caseItem.ticker}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  caseItem.status === CaseStatus.OPEN 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-navy-700 dark:text-white'
                }`}>
                  {caseItem.status}
                </span>
              </div>
              <p className="text-gray-700 dark:text-navy-200 mt-2">
                {caseItem.description}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setSelectedCase(caseItem);
                  setIsEditModalOpen(true);
                }}
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-navy-700 p-2 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              {/* <button 
                className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-navy-700 p-2 rounded"
              >
                <Eye className="w-4 h-4" />
              </button> */}
              <button 
                onClick={() => handleDeleteCase(caseItem.id)}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-navy-700 p-2 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Case Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Create New Case
            </h3>
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="Ticker Symbol"
                value={newCase.ticker || ''}
                onChange={(e) => setNewCase(prev => ({ ...prev, ticker: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
              />
              <select 
                value={newCase.type || ''}
                onChange={(e) => setNewCase(prev => ({ ...prev, type: e.target.value as CaseType }))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
              >
                {Object.values(CaseType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select 
                value={newCase.priority || ''}
                onChange={(e) => setNewCase(prev => ({ ...prev, priority: e.target.value as CasePriority }))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
              >
                {Object.values(CasePriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <textarea 
                placeholder="Case Description"
                value={newCase.description || ''}
                onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={resetCreateModal}
                  className="px-4 py-2 border rounded-lg dark:border-navy-600 dark:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateCase}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                >
                  Create Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {isEditModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Edit Case
            </h3>
            <div className="space-y-4">
              <input 
                type="text"
                value={selectedCase.ticker}
                onChange={(e) => setSelectedCase(prev => prev ? { ...prev, ticker: e.target.value } : null)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
              />
              <select 
                value={selectedCase.type}
                onChange={(e) => setSelectedCase(prev => prev ? { ...prev, type: e.target.value as CaseType } : null)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
              >
                {Object.values(CaseType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select 
                value={selectedCase.priority}
                onChange={(e) => setSelectedCase(prev => prev ? { ...prev, priority: e.target.value as CasePriority } : null)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
              >
                {Object.values(CasePriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <textarea 
                value={selectedCase.description}
                onChange={(e) => setSelectedCase(prev => prev ? { ...prev, description: e.target.value } : null)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-700 dark:border-navy-600 dark:text-white"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={resetEditModal}
                  className="px-4 py-2 border rounded-lg dark:border-navy-600 dark:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateCase}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};