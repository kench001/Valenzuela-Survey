import { Card } from './Card';
import { Download, Filter, Calendar, TrendingUp, Users, Target, MapPin } from 'lucide-react';
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

export function Analytics() {
  const responseData = [
    { date: 'Jun 01', responses: 45 },
    { date: 'Jun 05', responses: 62 },
    { date: 'Jun 10', responses: 78 },
    { date: 'Jun 15', responses: 95 },
    { date: 'Jun 20', responses: 112 },
    { date: 'Jun 25', responses: 89 },
  ];

  const demographicData = [
    { age: '18-25', count: 145 },
    { age: '26-35', count: 289 },
    { age: '36-45', count: 324 },
    { age: '46-55', count: 198 },
    { age: '56+', count: 112 },
  ];

  const genderData = [
    { name: 'Male', value: 48 },
    { name: 'Female', value: 52 },
  ];

  const barangayData = [
    { barangay: 'Brgy 1', responses: 234 },
    { barangay: 'Brgy 2', responses: 189 },
    { barangay: 'Brgy 3', responses: 156 },
    { barangay: 'Brgy 4', responses: 198 },
    { barangay: 'Brgy 5', responses: 145 },
  ];

  const satisfactionData = [
    { category: 'Services', score: 4.2 },
    { category: 'Accessibility', score: 4.5 },
    { category: 'Staff', score: 4.7 },
    { category: 'Cleanliness', score: 4.1 },
    { category: 'Efficiency', score: 3.9 },
  ];

  const COLORS = ['#dc2626', '#7c3aed', '#2563eb', '#059669', '#f59e0b'];

  const stats = [
    { label: 'Total Responses', value: '3,847', change: '+24%', icon: Users, color: 'bg-blue-600' },
    { label: 'Avg Completion Time', value: '4m 32s', change: '-12%', icon: Calendar, color: 'bg-purple-600' },
    { label: 'Response Rate', value: '87.3%', change: '+5.2%', icon: Target, color: 'bg-green-600' },
    { label: 'Active Locations', value: '28', change: '+3', icon: MapPin, color: 'bg-red-600' },
  ];

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
        {stats.map((stat, index) => {
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
                {genderData.map((entry, index) => (
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
