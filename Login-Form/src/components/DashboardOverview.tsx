import { FileText, Users, BarChart3, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from './Card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DashboardOverview() {
  const stats = [
    { label: 'Total Surveys', value: '48', change: '+12%', icon: FileText, color: 'bg-blue-600' },
    { label: 'Active Surveys', value: '12', change: '+5%', icon: Clock, color: 'bg-green-600' },
    { label: 'Total Responses', value: '3,847', change: '+24%', icon: Users, color: 'bg-purple-600' },
    { label: 'Completion Rate', value: '87.3%', change: '+3.2%', icon: CheckCircle2, color: 'bg-red-600' },
  ];

  const responseData = [
    { month: 'Jan', responses: 245 },
    { month: 'Feb', responses: 312 },
    { month: 'Mar', responses: 289 },
    { month: 'Apr', responses: 456 },
    { month: 'May', responses: 523 },
    { month: 'Jun', responses: 678 },
  ];

  const surveyTypeData = [
    { name: 'Service Feedback', value: 35 },
    { name: 'Community Survey', value: 28 },
    { name: 'Event Feedback', value: 22 },
    { name: 'Other', value: 15 },
  ];

  const COLORS = ['#dc2626', '#7c3aed', '#2563eb', '#059669'];

  const recentSurveys = [
    { name: 'Q2 2024 Community Service Satisfaction Survey', responses: 487, status: 'Active', date: '2024-06-15' },
    { name: 'Public Transport Feedback', responses: 256, status: 'Active', date: '2024-06-10' },
    { name: 'Health Services Assessment', responses: 892, status: 'Completed', date: '2024-05-28' },
    { name: 'Youth Development Program Survey', responses: 145, status: 'Active', date: '2024-06-01' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your surveys today.</p>
        </div>
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg">
          Create New Survey
        </button>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-white mb-4">Response Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="responses" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-white mb-4">Survey Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={surveyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {surveyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {surveyTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Surveys */}
      <Card>
        <h3 className="text-white mb-4">Recent Surveys</h3>
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
              {recentSurveys.map((survey, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                  <td className="py-4 px-4 text-white">{survey.name}</td>
                  <td className="py-4 px-4 text-slate-300">{survey.responses}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full ${
                      survey.status === 'Active' 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {survey.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{survey.date}</td>
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
      </Card>
    </div>
  );
}
