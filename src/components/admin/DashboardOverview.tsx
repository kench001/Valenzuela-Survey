import { FileText, Users, BarChart3, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';

interface Survey {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdBy: string;
  createdAt: Timestamp;
  questions: any[];
  settings: any;
}

interface Response {
  id: string;
  surveyId: string;
  submittedAt: Timestamp;
  isComplete: boolean;
}

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface DashboardOverviewProps {
  onNavigate?: (page: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps = {}) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    completionRate: '0%'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch surveys
      const surveysQuery = query(
        collection(db, 'surveys'),
        orderBy('createdAt', 'desc')
      );
      const surveysSnapshot = await getDocs(surveysQuery);
      const surveysData = surveysSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Survey[];
      setSurveys(surveysData);

      // Fetch responses
      const responsesQuery = query(
        collection(db, 'responses'),
        orderBy('submittedAt', 'desc')
      );
      const responsesSnapshot = await getDocs(responsesQuery);
      const responsesData = responsesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Response[];
      setResponses(responsesData);

      // Fetch admins
      const adminsQuery = query(
        collection(db, 'admins'),
        orderBy('createdAt', 'desc')
      );
      const adminsSnapshot = await getDocs(adminsQuery);
      const adminsData = adminsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Admin[];
      setAdmins(adminsData);

      // Calculate stats
      const activeSurveys = surveysData.filter(s => s.status?.toLowerCase() === 'active').length;
      const completedResponses = responsesData.filter(r => r.isComplete).length;
      const completionRate = responsesData.length > 0 
        ? Math.round((completedResponses / responsesData.length) * 100)
        : 0;
      
      setStats({
        totalSurveys: surveysData.length,
        activeSurveys: activeSurveys,
        totalResponses: responsesData.length,
        completionRate: `${completionRate}%`
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResponseCount = (surveyId: string) => {
    return responses.filter(response => response.surveyId === surveyId).length;
  };

  const recentSurveys = surveys.slice(0, 5); // Show latest 5 surveys

  const statsCards = [
    { label: 'Total Surveys', value: stats.totalSurveys.toString(), change: '+12%', icon: FileText, color: 'bg-blue-600' },
    { label: 'Active Surveys', value: stats.activeSurveys.toString(), change: '+5%', icon: Clock, color: 'bg-green-600' },
    { label: 'Total Responses', value: stats.totalResponses.toLocaleString(), change: '+24%', icon: Users, color: 'bg-purple-600' },
    { label: 'Completion Rate', value: stats.completionRate, change: '+3.2%', icon: CheckCircle2, color: 'bg-red-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-white">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your surveys today.</p>
        </div>
        <button 
          onClick={() => onNavigate?.('surveys')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
        >
          Create New Survey
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-white text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold">Survey Management</h3>
          </div>
          <p className="text-slate-400 mb-4">Create, edit, and manage your surveys</p>
          <button 
            onClick={() => onNavigate?.('surveys')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manage Surveys
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold">Analytics</h3>
          </div>
          <p className="text-slate-400 mb-4">View detailed survey analytics and reports</p>
          <button 
            onClick={() => onNavigate?.('analytics')}
            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Analytics
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold">User Management</h3>
          </div>
          <p className="text-slate-400 mb-4">Manage admin users and permissions</p>
          <button 
            onClick={() => onNavigate?.('users')}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* Recent Surveys */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-4">Recent Surveys</h3>
        {recentSurveys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No surveys found</p>
            <p className="text-slate-500 mt-2">Create your first survey to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 py-3 px-4">Survey Name</th>
                  <th className="text-left text-slate-400 py-3 px-4">Responses</th>
                  <th className="text-left text-slate-400 py-3 px-4">Status</th>
                  <th className="text-left text-slate-400 py-3 px-4">Date Created</th>
                  <th className="text-left text-slate-400 py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentSurveys.map((survey) => (
                  <tr key={survey.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                    <td className="py-4 px-4 text-white">{survey.title}</td>
                    <td className="py-4 px-4 text-slate-300">{getResponseCount(survey.id)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        survey.status?.toLowerCase() === 'active' 
                          ? 'bg-green-600/20 text-green-400' 
                          : survey.status?.toLowerCase() === 'draft'
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-slate-600/20 text-slate-400'
                      }`}>
                        {survey.status || 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {survey.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-red-500 hover:text-red-400 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}