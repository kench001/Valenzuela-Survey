import { Card } from './Card';
import { Search, Star, Download, Eye } from 'lucide-react';
import { useState } from 'react';

interface SurveyTemplatesProps {
  onNavigate: (page: string) => void;
}

export function SurveyTemplates({ onNavigate }: SurveyTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    {
      id: 1,
      name: 'Service Satisfaction Survey',
      description: 'Comprehensive template for measuring citizen satisfaction with municipal services',
      category: 'Government Services',
      questions: 15,
      rating: 4.8,
      uses: 234,
      popular: true
    },
    {
      id: 2,
      name: 'Community Event Feedback',
      description: 'Gather feedback after community events, programs, or gatherings',
      category: 'Events',
      questions: 10,
      rating: 4.6,
      uses: 189,
      popular: true
    },
    {
      id: 3,
      name: 'Health Services Assessment',
      description: 'Evaluate healthcare facilities, services, and patient satisfaction',
      category: 'Healthcare',
      questions: 20,
      rating: 4.7,
      uses: 156,
      popular: false
    },
    {
      id: 4,
      name: 'Public Transport Survey',
      description: 'Assess public transportation quality, accessibility, and improvements needed',
      category: 'Transportation',
      questions: 12,
      rating: 4.5,
      uses: 142,
      popular: false
    },
    {
      id: 5,
      name: 'Youth Development Program',
      description: 'Survey for youth programs, education initiatives, and skill development',
      category: 'Education',
      questions: 18,
      rating: 4.9,
      uses: 198,
      popular: true
    },
    {
      id: 6,
      name: 'Environmental Awareness',
      description: 'Gauge community awareness and participation in environmental initiatives',
      category: 'Environment',
      questions: 14,
      rating: 4.4,
      uses: 123,
      popular: false
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Survey Templates</h1>
          <p className="text-slate-400 mt-1">Start quickly with pre-built survey templates</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Popular Templates */}
      <div>
        <h2 className="text-white text-xl font-semibold mb-4">Popular Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.filter(t => t.popular).map((template) => (
            <div key={template.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-red-500 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-sm">
                  {template.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{template.rating}</span>
                </div>
              </div>
              
              <h3 className="text-white text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-slate-400 mb-4 text-sm">{template.description}</p>
              
              <div className="flex items-center justify-between text-slate-400 mb-4 text-sm">
                <span>{template.questions} questions</span>
                <span>{template.uses} uses</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  onClick={() => onNavigate('form-builder')}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h2 className="text-white text-xl font-semibold mb-4">All Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.filter(t => !t.popular).map((template) => (
            <div key={template.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-red-500 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-slate-600/20 text-slate-400 rounded-full text-sm">
                  {template.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">{template.rating}</span>
                </div>
              </div>
              
              <h3 className="text-white text-lg font-semibold mb-2">{template.name}</h3>
              <p className="text-slate-400 mb-4 text-sm">{template.description}</p>
              
              <div className="flex items-center justify-between text-slate-400 mb-4 text-sm">
                <span>{template.questions} questions</span>
                <span>{template.uses} uses</span>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  onClick={() => onNavigate('form-builder')}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}