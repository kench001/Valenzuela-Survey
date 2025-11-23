import { Plus, Search, Filter, Edit, Trash2, Copy, Eye, MoreVertical } from 'lucide-react';
import { Card } from './Card';
import { useState } from 'react';

interface SurveyManagementProps {
  onNavigate: (page: string) => void;
}

export function SurveyManagement({ onNavigate }: SurveyManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const surveys = [
    { 
      id: 1, 
      title: 'Q2 2024 Community Service Satisfaction Survey',
      description: 'Comprehensive survey to gauge citizen satisfaction with municipal services',
      responses: 487,
      status: 'Active',
      created: '2024-06-15',
      version: 'v2.1',
      type: 'Service Feedback'
    },
    { 
      id: 2, 
      title: 'Public Transport Feedback',
      description: 'Assessment of public transportation system quality and accessibility',
      responses: 256,
      status: 'Active',
      created: '2024-06-10',
      version: 'v1.0',
      type: 'Community Survey'
    },
    { 
      id: 3, 
      title: 'Health Services Assessment',
      description: 'Evaluation of healthcare facilities and services across barangays',
      responses: 892,
      status: 'Completed',
      created: '2024-05-28',
      version: 'v3.0',
      type: 'Service Feedback'
    },
    { 
      id: 4, 
      title: 'Youth Development Program Survey',
      description: 'Gathering feedback on youth programs and initiatives',
      responses: 145,
      status: 'Active',
      created: '2024-06-01',
      version: 'v1.2',
      type: 'Event Feedback'
    },
    { 
      id: 5, 
      title: 'Environmental Awareness Campaign',
      description: 'Survey on environmental initiatives and community participation',
      responses: 0,
      status: 'Draft',
      created: '2024-06-20',
      version: 'v1.0',
      type: 'Community Survey'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white">Survey Management</h1>
          <p className="text-slate-400 mt-1">Create, manage, and monitor all your surveys</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('templates')}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Use Template
          </button>
          <button 
            onClick={() => onNavigate('form-builder')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Survey
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
            <button className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Survey Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surveys.map((survey) => (
          <Card key={survey.id} className="hover:border-red-500 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white">{survey.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    survey.status === 'Active' 
                      ? 'bg-green-600/20 text-green-400'
                      : survey.status === 'Draft'
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'bg-slate-600/20 text-slate-400'
                  }`}>
                    {survey.status}
                  </span>
                </div>
                <p className="text-slate-400">{survey.description}</p>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors p-2">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-slate-700">
              <div>
                <p className="text-slate-400">Responses</p>
                <p className="text-white mt-1">{survey.responses}</p>
              </div>
              <div>
                <p className="text-slate-400">Version</p>
                <p className="text-white mt-1">{survey.version}</p>
              </div>
              <div>
                <p className="text-slate-400">Type</p>
                <p className="text-white mt-1">{survey.type}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-400">Created: {survey.created}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => onNavigate('form-builder')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Preview">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Duplicate">
                  <Copy className="w-5 h-5" />
                </button>
                <button className="p-2 text-red-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
