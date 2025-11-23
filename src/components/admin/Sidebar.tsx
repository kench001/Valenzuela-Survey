import { LayoutDashboard, FileText, BarChart3, Settings, Users, FileBox, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'surveys', label: 'Survey Management', icon: FileText },
    { id: 'templates', label: 'Templates', icon: FileBox },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-white">Admin Portal</h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
            AD
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="text-white">Admin User</p>
              <p className="text-slate-400">admin@valenzuela.gov</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}