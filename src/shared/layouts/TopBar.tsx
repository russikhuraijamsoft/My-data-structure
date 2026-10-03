import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search, Sun, Moon, LogOut, User as UserIcon, Settings, Monitor } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { useAppStore } from '../../core/store/appStore';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { profile, user, logout } = useAuth();
  const isOffline = useAppStore(state => state.isOfflineMode);
  const [isDark, setIsDark] = React.useState(
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#ebd5da] flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#800000] hover:bg-[#fdf5f6] rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 text-[#800000]/60 absolute left-3" />
          <input 
            type="text" 
            placeholder="Search modules, bills, or items (Cmd+K)" 
            className="pl-9 pr-4 py-2 w-64 bg-[#fdf5f6] border border-[#ebd5da] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] text-[#800000] placeholder-[#800000]/50 transition-all focus:w-80 font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {isOffline && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fee8eb] text-[#800000] border border-[#ebd5da]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#800000]"></span>
            Offline Mode
          </span>
        )}

        <Link
          to="/kiosk"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fdf5f6] hover:bg-[#fee8eb] border border-[#ebd5da] text-[#800000] text-xs font-black transition-colors cursor-pointer"
          title="Open Self-Ordering Kiosk"
        >
          <Monitor className="w-4 h-4 text-[#800000]" />
          <span className="hidden sm:inline">Kiosk</span>
        </Link>
        
        <button className="p-2 text-[#800000] hover:bg-[#fdf5f6] rounded-lg transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
        </button>
        
        <button onClick={toggleTheme} className="p-2 text-[#800000] hover:bg-[#fdf5f6] rounded-lg transition-colors cursor-pointer">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-6 w-px bg-[#ebd5da] mx-1 hidden sm:block"></div>

        <div className="relative group">
          <button className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#fdf5f6] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {profile?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[#800000] leading-none mb-1">
                {profile?.displayName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-[#800000]/70 leading-none font-medium">
                {profile?.roles?.[0] || 'Owner'}
              </p>
            </div>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#ebd5da] py-1 hidden group-hover:block z-50">
            <div className="px-4 py-2.5 border-b border-[#ebd5da] bg-[#fdf5f6]">
              <p className="text-sm font-bold text-[#800000] truncate">{profile?.displayName || 'User'}</p>
              <p className="text-xs text-[#800000]/70 truncate font-medium">{user?.email}</p>
            </div>
            <button className="w-full text-left px-4 py-2 text-sm text-[#800000] hover:bg-[#fdf5f6] flex items-center gap-2 font-medium cursor-pointer">
              <UserIcon className="w-4 h-4 text-[#800000]" /> Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-[#800000] hover:bg-[#fdf5f6] flex items-center gap-2 font-medium cursor-pointer">
              <Settings className="w-4 h-4 text-[#800000]" /> Settings
            </button>
            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-[#800000] hover:bg-[#fee8eb] flex items-center gap-2 border-t border-[#ebd5da] font-semibold cursor-pointer">
              <LogOut className="w-4 h-4 text-[#800000]" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
