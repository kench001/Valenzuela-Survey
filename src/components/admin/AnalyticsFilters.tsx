import { useState } from 'react';
import { Card } from './Card';
import { Filter, X, Calendar, MapPin, Users, Briefcase } from 'lucide-react';

interface FilterState {
  dateRange: {
    start: string;
    end: string;
  };
  barangays: string[];
  ageGroups: string[];
  genders: string[];
  clientTypes: string[];
  surveyIds: string[];
}

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  availableOptions: {
    barangays: string[];
    ageGroups: string[];
    surveyIds: Array<{ id: string; title: string }>;
  };
  currentFilters: FilterState;
}

const VALENZUELA_BARANGAYS = [
  'Arkong Bato', 'Bagbaguin', 'Balangkas', 'Bignay', 'Bisig', 'Canumay East', 'Canumay West',
  'Coloong', 'Dalandanan', 'Gen. T. de Leon', 'Hen. T. de Leon', 'Isla', 'Karuhatan',
  'Lawang Bato', 'Lingunan', 'Mabolo', 'Malanday', 'Malinta', 'Mapulang Lupa', 'Marulas',
  'Maysan', 'Palasan', 'Parada', 'Pariancillo Villa', 'Paso de Blas', 'Pasolo', 'Poblacion',
  'Pulo', 'Punturin', 'Rincon', 'Tagalag', 'Ugong', 'Viente Reales', 'Wawang Pulo'
];

const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
const GENDERS = ['Male', 'Female'];
const CLIENT_TYPES = ['Citizen', 'Business', 'Government'];

export function AnalyticsFilters({ onFiltersChange, availableOptions, currentFilters }: AnalyticsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...localFilters, ...newFilters };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      dateRange: { start: '', end: '' },
      barangays: [],
      ageGroups: [],
      genders: [],
      clientTypes: [],
      surveyIds: []
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = () => {
    return localFilters.dateRange.start || 
           localFilters.dateRange.end || 
           localFilters.barangays.length > 0 || 
           localFilters.ageGroups.length > 0 || 
           localFilters.genders.length > 0 || 
           localFilters.clientTypes.length > 0 || 
           localFilters.surveyIds.length > 0;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.dateRange.start || localFilters.dateRange.end) count++;
    count += localFilters.barangays.length;
    count += localFilters.ageGroups.length;
    count += localFilters.genders.length;
    count += localFilters.clientTypes.length;
    count += localFilters.surveyIds.length;
    return count;
  };

  const handleArrayFilterChange = (filterKey: keyof FilterState, value: string, checked: boolean) => {
    const currentArray = localFilters[filterKey] as string[];
    let newArray;
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    updateFilters({ [filterKey]: newArray });
  };

  const toggleFilter = (filterKey: keyof FilterState, value: string) => {
    const currentArray = localFilters[filterKey] as string[];
    const isSelected = currentArray.includes(value);
    handleArrayFilterChange(filterKey, value, !isSelected);
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-500" />
            <h3 className="text-white font-semibold">Analytics Filters</h3>
            {hasActiveFilters() && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="text-slate-400 hover:text-white text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Quick Filters (Always Visible) */}
        <div className="space-y-3">
          {/* Date Range */}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <label className="text-slate-300 text-sm min-w-[60px]">Date:</label>
            <input
              type="date"
              value={localFilters.dateRange.start}
              onChange={(e) => updateFilters({
                dateRange: { ...localFilters.dateRange, start: e.target.value }
              })}
              className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:border-blue-500"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={localFilters.dateRange.end}
              onChange={(e) => updateFilters({
                dateRange: { ...localFilters.dateRange, end: e.target.value }
              })}
              className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Survey Filter */}
          {availableOptions.surveyIds.length > 1 && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <label className="text-slate-300 text-sm min-w-[60px]">Survey:</label>
              <select
                value={localFilters.surveyIds[0] || ''}
                onChange={(e) => updateFilters({
                  surveyIds: e.target.value ? [e.target.value] : []
                })}
                className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:border-blue-500"
              >
                <option value="">All Surveys</option>
                {availableOptions.surveyIds.map(survey => (
                  <option key={survey.id} value={survey.id}>
                    {survey.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-slate-700">
            {/* Barangay Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <h4 className="text-white text-sm font-medium">Barangays</h4>
                {localFilters.barangays.length > 0 && (
                  <span className="text-blue-400 text-xs">
                    ({localFilters.barangays.length} selected)
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {VALENZUELA_BARANGAYS.map(barangay => (
                  <label key={barangay} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-700 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={localFilters.barangays.includes(barangay)}
                      onChange={(e) => handleArrayFilterChange('barangays', barangay, e.target.checked)}
                      className="w-3 h-3 text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500 focus:ring-1"
                    />
                    <span className={`${localFilters.barangays.includes(barangay) ? 'text-blue-300' : 'text-slate-300'}`}>
                      {barangay}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Demographics Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Age Groups */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <h4 className="text-white text-sm font-medium">Age Groups</h4>
                </div>
                <div className="space-y-2">
                  {AGE_GROUPS.map(age => (
                    <button
                      key={age}
                      onClick={() => toggleFilter('ageGroups', age)}
                      className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                        localFilters.ageGroups.includes(age)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3">Gender</h4>
                <div className="space-y-2">
                  {GENDERS.map(gender => (
                    <button
                      key={gender}
                      onClick={() => toggleFilter('genders', gender)}
                      className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                        localFilters.genders.includes(gender)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Type */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3">Client Type</h4>
                <div className="space-y-2">
                  {CLIENT_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter('clientTypes', type)}
                      className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                        localFilters.clientTypes.includes(type)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="pt-3 border-t border-slate-700">
            <div className="text-xs text-slate-400 mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {localFilters.dateRange.start && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  Date: {localFilters.dateRange.start}
                  {localFilters.dateRange.end && ` - ${localFilters.dateRange.end}`}
                  <button
                    onClick={() => updateFilters({ dateRange: { start: '', end: '' } })}
                    className="hover:bg-blue-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {localFilters.barangays.map(barangay => (
                <span key={barangay} className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {barangay}
                  <button
                    onClick={() => handleArrayFilterChange('barangays', barangay, false)}
                    className="hover:bg-green-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {localFilters.ageGroups.map(age => (
                <span key={age} className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  Age: {age}
                  <button
                    onClick={() => handleArrayFilterChange('ageGroups', age, false)}
                    className="hover:bg-purple-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {localFilters.genders.map(gender => (
                <span key={gender} className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {gender}
                  <button
                    onClick={() => handleArrayFilterChange('genders', gender, false)}
                    className="hover:bg-orange-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}