import { Card } from './Card';
import { Plus, Search, Edit, Trash2, Shield, Mail } from 'lucide-react';
import { useState } from 'react';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { 
      id: 1, 
      name: 'Juan Dela Cruz', 
      email: 'juan.delacruz@valenzuela.gov.ph', 
      role: 'Admin',
      department: 'IT Department',
      status: 'Active',
      lastLogin: '2024-06-23 10:30 AM'
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      email: 'maria.santos@valenzuela.gov.ph', 
      role: 'Survey Manager',
      department: 'Community Affairs',
      status: 'Active',
      lastLogin: '2024-06-23 09:15 AM'
    },
    { 
      id: 3, 
      name: 'Pedro Reyes', 
      email: 'pedro.reyes@valenzuela.gov.ph', 
      role: 'Analyst',
      department: 'Data Analytics',
      status: 'Active',
      lastLogin: '2024-06-22 04:45 PM'
    },
    { 
      id: 4, 
      name: 'Ana Garcia', 
      email: 'ana.garcia@valenzuela.gov.ph', 
      role: 'Survey Manager',
      department: 'Health Services',
      status: 'Active',
      lastLogin: '2024-06-23 08:20 AM'
    },
    { 
      id: 5, 
      name: 'Carlos Torres', 
      email: 'carlos.torres@valenzuela.gov.ph', 
      role: 'Viewer',
      department: 'Public Relations',
      status: 'Inactive',
      lastLogin: '2024-06-15 03:30 PM'
    },
  ];

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
          <h1 className="text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Manage users, roles, and permissions</p>
        </div>
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Search */}
      <Card>
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
      </Card>

      {/* Users Table */}
      <Card>
        <h3 className="text-white mb-4">User List</h3>
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
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'Admin' ? 'bg-red-600/20 text-red-400' :
                      user.role === 'Survey Manager' ? 'bg-purple-600/20 text-purple-400' :
                      user.role === 'Analyst' ? 'bg-blue-600/20 text-blue-400' :
                      'bg-green-600/20 text-green-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{user.department}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.status === 'Active' 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-slate-600/20 text-slate-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{user.lastLogin}</td>
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
        </div>
      </Card>

      {/* Roles and Permissions */}
      <Card>
        <h3 className="text-white mb-4">Roles & Permissions Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.name} className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className={`${role.color} p-2 rounded-lg`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-white">{role.name}</h4>
              </div>
              <div className="space-y-2">
                {role.permissions.map((perm, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Permissions Table */}
      <Card>
        <h3 className="text-white mb-4">Detailed Permissions</h3>
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
                    {row.admin ? <span className="text-green-500">✓</span> : <span className="text-slate-600">✗</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.manager ? <span className="text-green-500">✓</span> : <span className="text-slate-600">✗</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.analyst ? <span className="text-green-500">✓</span> : <span className="text-slate-600">✗</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.viewer ? <span className="text-green-500">✓</span> : <span className="text-slate-600">✗</span>}
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
