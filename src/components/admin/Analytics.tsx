import { Card } from './Card';
import { Download, Filter, Calendar, TrendingUp, Users, Target, MapPin, RefreshCw, FileText, FileSpreadsheet, Activity, BarChart3, Map } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  onSnapshot,
  where
} from 'firebase/firestore';
import { ResponseMap } from './ResponseMap';
import { QuestionAnalytics } from './QuestionAnalytics';
import { AnalyticsFilters } from './AnalyticsFilters';
import { PDFReportGenerator } from './PDFReportGenerator';
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
  const [isRealTime, setIsRealTime] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [newResponseNotification, setNewResponseNotification] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'map' | 'questions'>('overview');
  const [filteredResponses, setFilteredResponses] = useState<Response[]>([]);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [mapMetric, setMapMetric] = useState<'responses' | 'satisfaction' | 'responseRate'>('responses');
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    barangays: [],
    ageGroups: [],
    genders: [],
    clientTypes: [],
    surveyIds: []
  });
  const [stats, setStats] = useState({
    totalResponses: 0,
    todayResponses: 0,
    avgCompletionTime: '0m 0s',
    responseRate: '0%',
    activeLocations: 0
  });

  useEffect(() => {
    if (isRealTime) {
      // Set up real-time listener
      const unsubscribe = onSnapshot(
        query(collection(db, 'responses'), orderBy('submittedAt', 'desc')),
        (snapshot) => {
          const responsesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Response[];
          
          // Check for new responses
          if (responses.length > 0 && responsesData.length > responses.length) {
            const newCount = responsesData.length - responses.length;
            setNewResponseNotification(`${newCount} new response${newCount > 1 ? 's' : ''} received!`);
            setTimeout(() => setNewResponseNotification(null), 5000);
          }
          
          setResponses(responsesData);
          updateStats(responsesData);
          setLastUpdated(new Date());
        },
        (error) => {
          console.error('Real-time listener error:', error);
        }
      );
      
      return () => unsubscribe();
    } else {
      fetchAnalyticsData();
    }
  }, [isRealTime, responses.length]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const updateStats = useCallback((responsesData: Response[]) => {
    const today = new Date().toDateString();
    const todayResponses = responsesData.filter(r => 
      r.submittedAt?.toDate()?.toDateString() === today
    ).length;
    
    const uniqueBarangays = new Set(
      responsesData.map(r => r.demographics?.barangay).filter(Boolean)
    ).size;
    
    setStats({
      totalResponses: responsesData.length,
      todayResponses,
      avgCompletionTime: '4m 32s', // Calculate from actual data if available
      responseRate: '85%', // Calculate from views vs completions
      activeLocations: uniqueBarangays
    });
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

      updateStats(responsesData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to responses
  useEffect(() => {
    let filtered = responses;

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(response => {
        const responseDate = response.submittedAt?.toDate();
        if (!responseDate) return false;
        
        const dateStr = responseDate.toISOString().split('T')[0];
        
        if (filters.dateRange.start && dateStr < filters.dateRange.start) return false;
        if (filters.dateRange.end && dateStr > filters.dateRange.end) return false;
        
        return true;
      });
    }

    // Demographic filters
    if (filters.barangays.length > 0) {
      filtered = filtered.filter(r => filters.barangays.includes(r.demographics?.barangay || ''));
    }
    
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter(r => filters.ageGroups.includes(r.demographics?.age || ''));
    }
    
    if (filters.genders.length > 0) {
      filtered = filtered.filter(r => filters.genders.includes(r.demographics?.sex || ''));
    }
    
    if (filters.clientTypes.length > 0) {
      filtered = filtered.filter(r => filters.clientTypes.includes(r.demographics?.clientType || ''));
    }

    if (filters.surveyIds.length > 0) {
      filtered = filtered.filter(r => filters.surveyIds.includes(r.surveyId));
    }

    setFilteredResponses(filtered);
    updateStats(filtered);
  }, [responses, filters, updateStats]);

  // Enhanced PDF report generation
  const generatePDFReport = async () => {
    try {
      const demographicData = getDemographicData();
      const barangayData = getBarangayData();
      const genderData = getGenderData();
      
      // Get questions from active survey
      const activeSurvey = surveys.find(s => s.status === 'active');
      const questionAnalysis = activeSurvey?.questions?.map((q: any) => {
        const questionResponses = filteredResponses
          .map(r => r.answers[q.id])
          .filter(Boolean);
          
        return {
          id: q.id,
          label: q.label,
          type: q.type,
          analysis: {
            totalResponses: questionResponses.length,
            responseRate: Math.round((questionResponses.length / filteredResponses.length) * 100)
          }
        };
      }) || [];

      await PDFReportGenerator.generateQuickReport({
        title: 'Comprehensive Survey Analytics Report',
        summary: {
          totalResponses: stats.totalResponses,
          todayResponses: stats.todayResponses,
          responseRate: stats.responseRate,
          activeLocations: stats.activeLocations
        },
        demographics: {
          age: demographicData,
          gender: genderData,
          barangay: barangayData
        },
        questions: questionAnalysis
      });
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  // Process data for charts
  const getResponseTrends = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayResponses = filteredResponses.filter(r => {
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
      count: filteredResponses.filter(r => r.demographics?.age === age).length
    }));
  };

  const getGenderData = () => {
    const maleCount = filteredResponses.filter(r => r.demographics?.gender?.toLowerCase() === 'male').length;
    const femaleCount = filteredResponses.filter(r => r.demographics?.gender?.toLowerCase() === 'female').length;
    const total = maleCount + femaleCount;
    
    if (total === 0) return [{ name: 'No Data', value: 100 }];
    
    return [
      { name: 'Male', value: Math.round((maleCount / total) * 100) },
      { name: 'Female', value: Math.round((femaleCount / total) * 100) }
    ];
  };

  const getBarangayData = () => {
    const barangayAnalytics: Record<string, {
      responses: number;
      demographics: {
        ageGroups: Record<string, number>;
        gender: Record<string, number>;
        avgSatisfaction: number;
      };
      responseRate: number;
      trends: {
        dailyResponses: number[];
        growth: number;
      };
    }> = {};

    // Initialize data for all responses
    filteredResponses.forEach(r => {
      const barangay = r.demographics?.barangay || 'Unknown';
      
      if (!barangayAnalytics[barangay]) {
        barangayAnalytics[barangay] = {
          responses: 0,
          demographics: {
            ageGroups: { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 },
            gender: { 'Male': 0, 'Female': 0, 'Other': 0 },
            avgSatisfaction: 0
          },
          responseRate: 0,
          trends: {
            dailyResponses: Array(7).fill(0), // Last 7 days
            growth: 0
          }
        };
      }

      const data = barangayAnalytics[barangay];
      data.responses++;

      // Demographics
      const age = r.demographics?.age || '18-25';
      const ageGroup = age.includes('18') ? '18-25' : 
                     age.includes('26') ? '26-35' :
                     age.includes('36') ? '36-45' :
                     age.includes('46') ? '46-55' : '55+';
      data.demographics.ageGroups[ageGroup]++;

      const gender = r.demographics?.gender || 'Other';
      data.demographics.gender[gender]++;

      // Calculate satisfaction from answers (assuming likert scale 1-5)
      const satisfactionAnswers = Object.values(r.answers || {})
        .filter(answer => typeof answer === 'string' && /^[1-5]$/.test(answer))
        .map(answer => parseInt(answer));
      
      if (satisfactionAnswers.length > 0) {
        const avgSat = satisfactionAnswers.reduce((sum, val) => sum + val, 0) / satisfactionAnswers.length;
        data.demographics.avgSatisfaction = data.demographics.avgSatisfaction === 0 ? 
          avgSat : (data.demographics.avgSatisfaction + avgSat) / 2;
      }

      // Daily trend data (last 7 days)
      const responseDate = r.submittedAt?.toDate();
      if (responseDate) {
        const daysDiff = Math.floor((new Date().getTime() - responseDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff < 7) {
          data.trends.dailyResponses[6 - daysDiff]++;
        }
      }
    });

    // Calculate percentages and growth trends
    Object.keys(barangayAnalytics).forEach(barangay => {
      const data = barangayAnalytics[barangay];
      const total = data.responses;
      
      // Convert demographics to percentages
      Object.keys(data.demographics.ageGroups).forEach(ageGroup => {
        data.demographics.ageGroups[ageGroup] = 
          total > 0 ? Math.round((data.demographics.ageGroups[ageGroup] / total) * 100) : 0;
      });
      
      Object.keys(data.demographics.gender).forEach(gender => {
        data.demographics.gender[gender] = 
          total > 0 ? Math.round((data.demographics.gender[gender] / total) * 100) : 0;
      });

      // Calculate response rate (mock data - in real scenario, you'd compare to population)
      data.responseRate = Math.min(100, Math.max(10, total * 0.8 + Math.random() * 20));
      
      // Calculate growth trend (comparing recent vs earlier responses)
      const recentDays = data.trends.dailyResponses.slice(-3).reduce((a, b) => a + b, 0);
      const earlierDays = data.trends.dailyResponses.slice(0, 3).reduce((a, b) => a + b, 0);
      data.trends.growth = earlierDays > 0 ? 
        ((recentDays - earlierDays) / earlierDays) * 100 : 
        recentDays > 0 ? 100 : 0;
    });
    
    return Object.entries(barangayAnalytics)
      .map(([barangay, data]) => ({ barangay, ...data }))
      .sort((a, b) => b.responses - a.responses);
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

  // Export Functions
  const exportToCSV = () => {
    const csvData = filteredResponses.map(response => ({
      'Survey ID': response.surveyId,
      'Submitted At': response.submittedAt?.toDate()?.toLocaleString() || 'N/A',
      'Age': response.demographics?.age || 'N/A',
      'Gender': response.demographics?.gender || 'N/A',
      'Barangay': response.demographics?.barangay || 'N/A',
      'Client Type': response.demographics?.clientType || 'N/A',
      'Service': response.demographics?.service || 'N/A',
      'Is Complete': response.isComplete ? 'Yes' : 'No',
      ...response.answers
    }));
    
    const csv = convertToCSV(csvData);
    downloadFile(csv, 'survey-responses.csv', 'text/csv');
  };

  const exportSummaryReport = () => {
    const summaryData = {
      'Generated At': new Date().toLocaleString(),
      'Total Responses': stats.totalResponses,
      'Today\'s Responses': stats.todayResponses,
      'Response Rate': stats.responseRate,
      'Active Locations': stats.activeLocations,
      'Demographics': {
        'Age Distribution': demographicData,
        'Gender Distribution': genderData,
        'Top Barangays': barangayData.slice(0, 5)
      },
      'Satisfaction Scores': satisfactionData
    };
    
    const json = JSON.stringify(summaryData, null, 2);
    downloadFile(json, 'analytics-summary.json', 'application/json');
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statsCards = [
    { 
      label: 'Total Responses', 
      value: stats.totalResponses.toString(), 
      subValue: `+${stats.todayResponses} today`,
      change: '+24%', 
      icon: Users, 
      color: 'bg-blue-600' 
    },
    { 
      label: 'Avg Completion Time', 
      value: stats.avgCompletionTime, 
      subValue: 'Per response',
      change: '-12%', 
      icon: Calendar, 
      color: 'bg-purple-600' 
    },
    { 
      label: 'Response Rate', 
      value: stats.responseRate, 
      subValue: 'Completion rate',
      change: '+5.2%', 
      icon: Target, 
      color: 'bg-green-600' 
    },
    { 
      label: 'Active Locations', 
      value: stats.activeLocations.toString(), 
      subValue: 'Unique barangays',
      change: '+3', 
      icon: MapPin, 
      color: 'bg-red-600' 
    },
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
      {/* New Response Notification */}
      {newResponseNotification && (
        <div className="bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 animate-slide-down">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>{newResponseNotification}</span>
          <button 
            onClick={() => setNewResponseNotification(null)}
            className="ml-auto text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-white">Analytics & Statistics</h1>
            {isRealTime && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Live</span>
              </div>
            )}
          </div>
          <p className="text-slate-400 mt-1">
            Comprehensive insights and data visualization
            <span className="ml-2 text-xs">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsRealTime(!isRealTime)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isRealTime 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            <Activity className="w-4 h-4" />
            {isRealTime ? 'Live Mode' : 'Enable Live'}
          </button>
          <button 
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="relative group">
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={exportToCSV}
                className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export as CSV
              </button>
              <button
                onClick={exportSummaryReport}
                className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Summary Report
              </button>
              <button
                onClick={generatePDFReport}
                className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2 rounded-b-lg"
              >
                <FileText className="w-4 h-4" />
                PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{stat.subValue}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500 text-sm">{stat.change}</span>
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

      {/* Analytics Filters */}
      <AnalyticsFilters
        onFiltersChange={setFilters}
        availableOptions={{
          barangays: Array.from(new Set(responses.map(r => r.demographics?.barangay).filter(Boolean))),
          ageGroups: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
          surveyIds: surveys.map(s => ({ id: s.id, title: s.title }))
        }}
        currentFilters={filters}
      />

      {/* View Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-white">Analytics Views</h2>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeView === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeView === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Map className="w-4 h-4" />
            Geographic Map
          </button>
          <button
            onClick={() => setActiveView('questions')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeView === 'questions'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Target className="w-4 h-4" />
            Question Analysis
          </button>
        </div>
      </div>

      {/* Geographic Map View */}
      {activeView === 'map' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-blue-500" />
              <h3 className="text-white text-lg font-semibold">Geographic Response Analytics</h3>
            </div>
            
            {/* Map Controls */}
            <div className="flex gap-2">
              <select
                value={mapMetric}
                onChange={(e) => setMapMetric(e.target.value as 'responses' | 'satisfaction' | 'responseRate')}
                className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-1 text-sm"
              >
                <option value="responses">Response Volume</option>
                <option value="satisfaction">Satisfaction Levels</option>
                <option value="responseRate">Response Rates</option>
              </select>
              
              {selectedBarangay && (
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                  <span>📍 {selectedBarangay}</span>
                  <button 
                    onClick={() => setSelectedBarangay(null)}
                    className="hover:bg-blue-700 px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <ResponseMap 
            barangayData={getBarangayData()} 
            selectedMetric={mapMetric}
            timeRange={filters.dateRange.start ? 
              `${filters.dateRange.start} to ${filters.dateRange.end}` : 
              'All Time'
            }
            onBarangaySelect={(barangay) => {
              setSelectedBarangay(barangay.barangay);
              // You could also filter responses by barangay here
              // setFilters(prev => ({ ...prev, barangays: [barangay.barangay] }));
            }}
          />
          
          {selectedBarangay && (
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h4 className="text-white font-semibold mb-3">
                📊 {selectedBarangay} Detailed Analytics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {(() => {
                  const barangayDetail = getBarangayData().find(b => b.barangay === selectedBarangay);
                  if (!barangayDetail) return <div className="text-gray-400">No data available</div>;
                  
                  return (
                    <>
                      <div>
                        <div className="text-gray-400 mb-2">Response Summary</div>
                        <div className="text-white space-y-1">
                          <div>Total: <span className="font-bold">{barangayDetail.responses}</span></div>
                          <div>Rate: <span className="font-bold">{barangayDetail.responseRate.toFixed(1)}%</span></div>
                          <div>Growth: <span className={`font-bold ${barangayDetail.trends.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {barangayDetail.trends.growth >= 0 ? '+' : ''}{barangayDetail.trends.growth.toFixed(1)}%
                          </span></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400 mb-2">Demographics</div>
                        <div className="text-white space-y-1">
                          {Object.entries(barangayDetail.demographics.gender)
                            .filter(([_, value]) => value > 0)
                            .map(([gender, percentage]) => (
                              <div key={gender}>{gender}: <span className="font-bold">{percentage}%</span></div>
                            ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400 mb-2">Quality Metrics</div>
                        <div className="text-white space-y-1">
                          <div>Satisfaction: <span className="font-bold">{barangayDetail.demographics.avgSatisfaction.toFixed(1)}/5.0</span></div>
                          <div>Weekly Trend: 
                            <span className="ml-2">
                              {barangayDetail.trends.dailyResponses.map((count, i) => (
                                <span key={i} className="inline-block w-1 h-3 bg-blue-500 mr-1 rounded" 
                                  style={{opacity: count / Math.max(...barangayDetail.trends.dailyResponses)}} />
                              ))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Question Analytics View */}
      {activeView === 'questions' && (
        <QuestionAnalytics 
          questions={surveys.find(s => s.status === 'active')?.questions || []}
          responses={filteredResponses}
        />
      )}

      {/* Overview View (Default Charts) */}
      {activeView === 'overview' && (
        <>
          {/* Response Trends */}
          <Card>
            <h3 className="text-white mb-4">Response Trends (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getResponseTrends()}>
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
              <button 
                onClick={generatePDFReport}
                className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span>PDF Report</span>
                  <Download className="w-5 h-5" />
                </div>
                <p className="text-slate-400">Full analytics report with charts</p>
              </button>
              <button 
                onClick={exportSummaryReport}
                className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span>Excel Export</span>
                  <Download className="w-5 h-5" />
                </div>
                <p className="text-slate-400">Raw data in spreadsheet format</p>
              </button>
              <button 
                onClick={exportToCSV}
                className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span>CSV Export</span>
                  <Download className="w-5 h-5" />
                </div>
                <p className="text-slate-400">Comma-separated values file</p>
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}