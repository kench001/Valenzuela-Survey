import { Card } from './Card';
import { Download, Filter, Calendar, TrendingUp, Users, Target, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface Response {
  id: string;
  surveyId: string;
  submittedAt: Timestamp;
  demographics: {
    age: string;
    gender: string;
    barangay: string;
  };
  answers: Record<string, string>;
  isComplete: boolean;
}

interface Survey {
  id: string;
  title: string;
  status: string;
  createdAt: Timestamp;
}

export function Analytics() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResponses: 0,
    avgCompletionTime: '0m 0s',
    responseRate: '0%',
    activeLocations: 0
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
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

      // Calculate stats
      const uniqueBarangays = new Set(responsesData.map(r => r.demographics?.barangay)).size;
      const activeSurveys = surveysData.filter(s => s.status === 'active').length;
      const responseRate = surveysData.length > 0 ? Math.round((responsesData.length / surveysData.length) * 100) : 0;
      
      setStats({
        totalResponses: responsesData.length,
        avgCompletionTime: '4m 32s', // Calculate from actual data if available
        responseRate: `${responseRate}%`,
        activeLocations: uniqueBarangays || 0
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const getResponseTrends = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayResponses = responses.filter(r => {
        const responseDate = r.submittedAt?.toDate()?.toISOString().split('T')[0];
        return responseDate === dateStr;
      });
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        responses: dayResponses.length
      });
    }
    return last7Days;
  };

  const getDemographicData = () => {
    const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'];
    return ageGroups.map(age => ({
      age,
      count: responses.filter(r => r.demographics?.age === age).length
    }));
  };

  const getGenderData = () => {
    const maleCount = responses.filter(r => r.demographics?.gender?.toLowerCase() === 'male').length;
    const femaleCount = responses.filter(r => r.demographics?.gender?.toLowerCase() === 'female').length;
    const total = maleCount + femaleCount;
    
    if (total === 0) return [{ name: 'No Data', value: 100 }];
    
    return [
      { name: 'Male', value: Math.round((maleCount / total) * 100) },
      { name: 'Female', value: Math.round((femaleCount / total) * 100) }
    ];
  };

  const getBarangayData = () => {
    const barangayCounts: Record<string, number> = {};
    responses.forEach(r => {
      const barangay = r.demographics?.barangay || 'Unknown';
      barangayCounts[barangay] = (barangayCounts[barangay] || 0) + 1;
    });
    
    return Object.entries(barangayCounts)
      .map(([barangay, count]) => ({ barangay, responses: count as number }))
      .sort((a, b) => (b.responses as number) - (a.responses as number))
      .slice(0, 10); // Top 10 barangays
  };

  const getSatisfactionData = () => {
    const categories = [
      { key: 'cc1', category: 'Services' },
      { key: 'cc2', category: 'Accessibility' },
      { key: 'cc3', category: 'Staff' },
      { key: 'sqd1', category: 'Overall' }
    ];
    
    return categories.map(cat => {
      const scores = responses
        .map(r => r.answers?.[cat.key])
        .filter(Boolean)
        .map(answer => {
          // Convert text responses to numeric scores
          if (typeof answer === 'string') {
            const lower = answer.toLowerCase();
            if (lower.includes('very satisfied') || lower.includes('excellent')) return 5;
            if (lower.includes('satisfied') || lower.includes('good')) return 4;
            if (lower.includes('neutral') || lower.includes('average')) return 3;
            if (lower.includes('dissatisfied') || lower.includes('poor')) return 2;
            if (lower.includes('very dissatisfied') || lower.includes('very poor')) return 1;
          }
          return 3; // Default neutral score
        });
      
      const avgScore = scores.length > 0 
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
        : 0;
      
      return { category: cat.category, score: Math.round(avgScore * 10) / 10 };
    });
  };

  const responseData = getResponseTrends();
  const demographicData = getDemographicData();
  const genderData = getGenderData();
  const barangayData = getBarangayData();
  const satisfactionData = getSatisfactionData();

  const COLORS = ['#dc2626', '#7c3aed', '#2563eb', '#059669', '#f59e0b'];

  const statsCards = [
    { label: 'Total Responses', value: stats.totalResponses.toString(), change: '+24%', icon: Users, color: 'bg-blue-600' },
    { label: 'Avg Completion Time', value: stats.avgCompletionTime, change: '-12%', icon: Calendar, color: 'bg-purple-600' },
    { label: 'Response Rate', value: stats.responseRate, change: '+5.2%', icon: Target, color: 'bg-green-600' },
    { label: 'Active Locations', value: stats.activeLocations.toString(), change: '+3', icon: MapPin, color: 'bg-red-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-white">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Analytics & Statistics</h1>
          <p className="text-slate-400 mt-1">Comprehensive insights and data visualization</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400">{stat.label}</p>
                  <p className="text-white mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Response Trends */}
      <Card>
        <h3 className="text-white mb-4">Real-time Response Dashboard</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            <Line type="monotone" dataKey="responses" stroke="#dc2626" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Demographics and Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-white mb-4">Demographic Breakdown by Age</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographicData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-white mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <h3 className="text-white mb-4">Geographic Distribution (Barangay Level)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barangayData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis dataKey="barangay" type="category" stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            />
            <Bar dataKey="responses" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Satisfaction Radar */}
      <Card>
        <h3 className="text-white mb-4">Service Satisfaction Scores</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={satisfactionData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="category" stroke="#9ca3af" />
            <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="#9ca3af" />
            <Radar name="Score" dataKey="score" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Export Options */}
      <Card>
        <h3 className="text-white mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left">
            <div className="flex items-center justify-between mb-2">
              <span>PDF Report</span>
              <Download className="w-5 h-5" />
            </div>
            <p className="text-slate-400">Full analytics report with charts</p>
          </button>
          <button className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left">
            <div className="flex items-center justify-between mb-2">
              <span>Excel Export</span>
              <Download className="w-5 h-5" />
            </div>
            <p className="text-slate-400">Raw data in spreadsheet format</p>
          </button>
          <button className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left">
            <div className="flex items-center justify-between mb-2">
              <span>CSV Export</span>
              <Download className="w-5 h-5" />
            </div>
            <p className="text-slate-400">Comma-separated values file</p>
          </button>
        </div>
      </Card>
    </div>
  );
}