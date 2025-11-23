import { Plus, Search, Filter, Edit, Trash2, Copy, Eye, MoreVertical } from 'lucide-react';
import { Card } from './Card';
import { useState, useEffect } from 'react';
import { FormBuilder } from './FormBuilder';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  isPrimary?: boolean;
  createdBy: string;
  createdAt: Timestamp;
  questions: any[];
  settings: any;
}

interface Response {
  id: string;
  surveyId: string;
  submittedAt: Timestamp;
}

interface SurveyManagementProps {
  onNavigate: (page: string) => void;
}

export function SurveyManagement({ onNavigate }: SurveyManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
    fetchResponses();
  }, []);

  const fetchSurveys = async () => {
    try {
      const surveysQuery = query(
        collection(db, 'surveys'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(surveysQuery);
      const surveysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Survey[];
      setSurveys(surveysData);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  const fetchResponses = async () => {
    try {
      const responsesQuery = query(
        collection(db, 'responses'),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(responsesQuery);
      const responsesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Response[];
      setResponses(responsesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setLoading(false);
    }
  };

  const getResponseCount = (surveyId: string) => {
    return responses.filter(response => response.surveyId === surveyId).length;
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteDoc(doc(db, 'surveys', surveyId));
        await fetchSurveys(); // Refresh the list
      } catch (error) {
        console.error('Error deleting survey:', error);
        alert('Error deleting survey. Please try again.');
      }
    }
  };

  const handleSetPrimary = async (surveyId: string) => {
    try {
      // First, set all other surveys to not primary
      const updatePromises = surveys
        .filter(s => s.isPrimary && s.id !== surveyId)
        .map(s => updateDoc(doc(db, 'surveys', s.id), { 
          isPrimary: false, 
          updatedAt: serverTimestamp() 
        }));
      
      await Promise.all(updatePromises);
      
      // Then set the selected survey as primary
      await updateDoc(doc(db, 'surveys', surveyId), { 
        isPrimary: true, 
        updatedAt: serverTimestamp() 
      });
      
      // Refresh the surveys list
      await fetchSurveys();
      
      alert('Survey set as primary for citizens!');
    } catch (error) {
      console.error('Error setting primary survey:', error);
      alert('Failed to set primary survey');
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || survey.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-white">Loading surveys...</span>
        </div>
      </div>
    );
  }

  if (showFormBuilder) {
    return <FormBuilder onBack={() => setShowFormBuilder(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold">Survey Management</h1>
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
            onClick={() => setShowFormBuilder(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Survey
          </button>
        </div>
      </div>
      
      {/* Citizen Control Banner */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h3 className="text-white text-lg font-semibold">Citizen Survey Control</h3>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-600"></div>
            <p className="text-slate-400 text-sm">
              Only surveys marked as <span className="text-blue-400 font-semibold">★ Primary</span> are shown to citizens
            </p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg px-4 py-2">
            <p className="text-blue-400 text-xs">
              💡 Use "Set as Primary" to control which survey citizens see
            </p>
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
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
      </div>

      {/* Survey Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSurveys.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-400 text-lg">No surveys found</p>
            <p className="text-slate-500 mt-2">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Create your first survey to get started'}
            </p>
          </div>
        ) : (
          filteredSurveys.map((survey) => (
            <div key={survey.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-red-500 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white text-lg font-semibold">{survey.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      survey.status.toLowerCase() === 'active' 
                        ? 'bg-green-600/20 text-green-400'
                        : survey.status.toLowerCase() === 'draft'
                        ? 'bg-yellow-600/20 text-yellow-400'
                        : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {survey.status}
                    </span>
                    {survey.isPrimary && (
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30">
                        ★ Primary Survey
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400">{survey.description}</p>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors p-2">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-slate-700">
                <div>
                  <p className="text-slate-400 text-sm">Responses</p>
                  <p className="text-white text-xl font-semibold mt-1">{getResponseCount(survey.id)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Questions</p>
                  <p className="text-white text-xl font-semibold mt-1">{survey.questions?.length || 0}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Category</p>
                  <p className="text-white text-sm font-semibold mt-1">{survey.category || 'General'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-slate-400">
                  Created: {survey.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
                </p>
                <div className="flex gap-2">
                  {survey.status.toLowerCase() === 'active' && !survey.isPrimary && (
                    <button 
                      onClick={() => handleSetPrimary(survey.id)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      title="Set as Primary Survey for Citizens"
                    >
                      Set as Primary
                    </button>
                  )}
                  <button 
                    onClick={() => setShowFormBuilder(true)}
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
                  <button 
                    onClick={() => handleDeleteSurvey(survey.id)}
                    className="p-2 text-red-500 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors" 
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}