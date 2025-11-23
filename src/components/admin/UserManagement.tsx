import { Card } from './Card';
import { Plus, Search, Edit, Trash2, Shield, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  department?: string;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  permissions?: {
    createSurveys?: boolean;
    viewAnalytics?: boolean;
    manageUsers?: boolean;
    systemSettings?: boolean;
  };
}

interface Citizen {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  barangay: string;
  createdAt: Timestamp;
  isVerified: boolean;
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'admins' | 'citizens'>('admins');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch admins with error handling
      try {
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
      } catch (adminsError) {
        console.warn('Could not fetch admins:', adminsError);
        setAdmins([]);
      }

      // Fetch citizens with error handling
      try {
        const citizensQuery = query(
          collection(db, 'citizens'),
          orderBy('createdAt', 'desc')
        );
        const citizensSnapshot = await getDocs(citizensQuery);
        const citizensData = citizensSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Citizen[];
        setCitizens(citizensData);
      } catch (citizensError) {
        console.warn('Could not fetch citizens:', citizensError);
        setCitizens([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      setAdmins([]);
      setCitizens([]);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCitizens = citizens.filter(citizen => 
    `${citizen.firstName || ''} ${citizen.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    citizen.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    citizen.barangay.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-white">Loading users...</span>
        </div>
      </div>
    );
  }

  const roles = [
    { name: 'Admin', color: 'bg-red-600', permissions: ['All Permissions'] },
    { name: 'Survey Manager', color: 'bg-purple-600', permissions: ['Create Surveys', 'Edit Surveys', 'View Analytics'] },
    { name: 'Analyst', color: 'bg-blue-600', permissions: ['View Analytics', 'Export Reports'] },
    { name: 'Viewer', color: 'bg-green-600', permissions: ['View Surveys', 'View Analytics'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">User Management</h1>
          <p className="text-slate-400 mt-1">Manage users, roles, and permissions</p>
        </div>
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="flex border-b border-slate-700">
          <button 
            onClick={() => setActiveTab('admins')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'admins' 
                ? 'text-red-400 border-b-2 border-red-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Administrators ({admins.length})
          </button>
          <button 
            onClick={() => setActiveTab('citizens')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'citizens' 
                ? 'text-red-400 border-b-2 border-red-400' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Citizens ({citizens.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'admins' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 py-3 px-4">Name</th>
                    <th className="text-left text-slate-400 py-3 px-4">Email</th>
                    <th className="text-left text-slate-400 py-3 px-4">Role</th>
                    <th className="text-left text-slate-400 py-3 px-4">Department</th>
                    <th className="text-left text-slate-400 py-3 px-4">Status</th>
                    <th className="text-left text-slate-400 py-3 px-4">Last Login</th>
                    <th className="text-left text-slate-400 py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white">
                            {admin.firstName?.[0]}{admin.lastName?.[0]}
                          </div>
                          <span className="text-white">{admin.firstName} {admin.lastName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{admin.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          admin.role === 'admin' ? 'bg-red-600/20 text-red-400' :
                          admin.role === 'survey_manager' ? 'bg-purple-600/20 text-purple-400' :
                          admin.role === 'analyst' ? 'bg-blue-600/20 text-blue-400' :
                          'bg-green-600/20 text-green-400'
                        }`}>
                          {admin.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{admin.department || 'N/A'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          admin.isActive 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-slate-600/20 text-slate-400'
                        }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {admin.lastLoginAt ? admin.lastLoginAt.toDate().toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors" title="Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAdmins.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No administrators found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 py-3 px-4">Name</th>
                    <th className="text-left text-slate-400 py-3 px-4">Email</th>
                    <th className="text-left text-slate-400 py-3 px-4">Barangay</th>
                    <th className="text-left text-slate-400 py-3 px-4">Verified</th>
                    <th className="text-left text-slate-400 py-3 px-4">Joined</th>
                    <th className="text-left text-slate-400 py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCitizens.map((citizen) => (
                    <tr key={citizen.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white">
                            {citizen.firstName?.[0] || citizen.email[0].toUpperCase()}
                          </div>
                          <span className="text-white">
                            {citizen.firstName && citizen.lastName 
                              ? `${citizen.firstName} ${citizen.lastName}` 
                              : citizen.email.split('@')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{citizen.email}</td>
                      <td className="py-4 px-4 text-slate-300">{citizen.barangay}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          citizen.isVerified 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}>
                          {citizen.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {citizen.createdAt.toDate().toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors" title="Email">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCitizens.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No citizens found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Roles and Permissions */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white text-xl font-semibold mb-4">Roles & Permissions Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.name} className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className={`${role.color} p-2 rounded-lg`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-white font-semibold">{role.name}</h4>
              </div>
              <div className="space-y-2">
                {role.permissions.map((perm, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300 text-sm">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white text-xl font-semibold mb-4">Detailed Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 py-3 px-4">Permission</th>
                <th className="text-center text-slate-400 py-3 px-4">Admin</th>
                <th className="text-center text-slate-400 py-3 px-4">Survey Manager</th>
                <th className="text-center text-slate-400 py-3 px-4">Analyst</th>
                <th className="text-center text-slate-400 py-3 px-4">Viewer</th>
              </tr>
            </thead>
            <tbody>
              {[
                { permission: 'Create Surveys', admin: true, manager: true, analyst: false, viewer: false },
                { permission: 'Edit Surveys', admin: true, manager: true, analyst: false, viewer: false },
                { permission: 'Delete Surveys', admin: true, manager: false, analyst: false, viewer: false },
                { permission: 'View Analytics', admin: true, manager: true, analyst: true, viewer: true },
                { permission: 'Export Reports', admin: true, manager: true, analyst: true, viewer: false },
                { permission: 'Manage Users', admin: true, manager: false, analyst: false, viewer: false },
                { permission: 'System Settings', admin: true, manager: false, analyst: false, viewer: false },
              ].map((row, index) => (
                <tr key={index} className="border-b border-slate-700">
                  <td className="py-3 px-4 text-white">{row.permission}</td>
                  <td className="py-3 px-4 text-center">
                    {row.admin ? <span className="text-green-500 text-lg">✓</span> : <span className="text-slate-600 text-lg">✗</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.manager ? <span className="text-green-500 text-lg">✓</span> : <span className="text-slate-600 text-lg">✗</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.analyst ? <span className="text-green-500 text-lg">✓</span> : <span className="text-slate-600 text-lg">✗</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.viewer ? <span className="text-green-500 text-lg">✓</span> : <span className="text-slate-600 text-lg">✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}