import { Menu, Bell, Search } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  logoImage: string;
}

export function TopBar({ onToggleSidebar, logoImage }: TopBarProps) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-300 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-white">CITY GOVERNMENT OF VALENZUELA</h1>
              <p className="text-slate-400">Metropolitan Manila</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-red-500 transition-colors w-64"
            />
          </div>
          
          <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
