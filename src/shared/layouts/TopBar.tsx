import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Monitor, Moon, Search, Settings, Sun, X } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { useAppStore } from '../../core/store/appStore';
import { getVisibleNavigation } from './navigation';

interface TopBarProps {
  isMenuOpen: boolean;
  onMenuClick: () => void;
}

export function TopBar({ isMenuOpen, onMenuClick }: TopBarProps) {
  const { profile, user, logout } = useAuth();
  const isOffline = useAppStore((state) => state.isOfflineMode);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => setSystemIsDark(mediaQuery.matches);

    updateSystemTheme();
    mediaQuery.addEventListener('change', updateSystemTheme);
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsProfileMenuOpen(false);
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileMenuOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!searchContainerRef.current?.contains(target)) setIsSearchOpen(false);
      if (!profileMenuRef.current?.contains(target)) setIsProfileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  const isDark = theme === 'dark' || (theme === 'system' && systemIsDark);
  const visibleNavigation = getVisibleNavigation(profile?.roles);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = visibleNavigation
    .filter((item) => !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery))
    .slice(0, 6);
  const displayName = profile?.displayName || user?.email?.split('@')[0] || 'User';

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSearchResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#ebd5da] bg-white px-4 lg:px-8">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="sidebar"
          aria-expanded={isMenuOpen}
          className="cursor-pointer rounded-lg p-2 text-[#800000] transition-colors hover:bg-[#fdf5f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] lg:hidden"
        >
          {isMenuOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        </button>

        <div ref={searchContainerRef} className="relative flex min-w-0 items-center">
          <Search aria-hidden="true" className="absolute left-3 h-4 w-4 text-[#800000]/60" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            aria-label="Search modules"
            aria-controls="module-search-results"
            aria-expanded={isSearchOpen}
            aria-autocomplete="list"
            placeholder="Search modules"
            className="w-36 rounded-lg border border-[#ebd5da] bg-[#fdf5f6] py-2 pl-9 pr-3 text-sm font-medium text-[#800000] placeholder-[#800000]/50 transition-all focus:w-44 focus:outline-none focus:ring-2 focus:ring-[#800000] sm:w-52 sm:pr-16 sm:focus:w-64 lg:w-64 lg:focus:w-80"
          />
          <span className="pointer-events-none absolute right-3 hidden rounded border border-[#ebd5da] bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#800000]/60 sm:inline">
            Ctrl K
          </span>

          {isSearchOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#ebd5da] bg-white shadow-xl sm:w-80">
              <div className="flex items-center justify-between border-b border-[#ebd5da] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#800000]/70">Jump to a module</p>
                <span className="text-[10px] font-medium text-[#800000]/60">Esc to close</span>
              </div>

              {searchResults.length > 0 ? (
                <ul id="module-search-results" role="listbox" aria-label="Matching modules" className="max-h-80 overflow-y-auto p-2">
                  {searchResults.map((item) => (
                    <li key={item.name}>
                      <Link
                        role="option"
                        to={item.to}
                        onClick={handleSearchResultClick}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#800000] transition-colors hover:bg-[#fdf5f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000]"
                      >
                        <item.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p role="status" className="px-4 py-5 text-sm text-[#800000]/70">
                  No modules match “{searchQuery.trim()}”.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-2 sm:gap-4">
        {isOffline && (
          <span className="hidden items-center gap-1.5 rounded-full border border-[#ebd5da] bg-[#fee8eb] px-2.5 py-1 text-xs font-semibold text-[#800000] sm:inline-flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#800000]" />
            Offline Mode
          </span>
        )}

        <Link
          to="/kiosk"
          aria-label="Open Self-Ordering Kiosk"
          title="Open Self-Ordering Kiosk"
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#ebd5da] bg-[#fdf5f6] px-3 py-1.5 text-xs font-black text-[#800000] transition-colors hover:bg-[#fee8eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000]"
        >
          <Monitor aria-hidden="true" className="h-4 w-4 text-[#800000]" />
          <span className="hidden sm:inline">Kiosk</span>
        </Link>

        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="cursor-pointer rounded-lg p-2 text-[#800000] transition-colors hover:bg-[#fdf5f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000]"
        >
          {isDark ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
        </button>

        <div className="mx-1 hidden h-6 w-px bg-[#ebd5da] sm:block" />

        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((open) => !open)}
            aria-label={`Account menu for ${displayName}`}
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
            aria-controls="account-menu"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-[#fdf5f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000]"
          >
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#800000] text-sm font-bold text-white shadow-xs">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-left sm:block">
              <span className="mb-1 block text-sm font-bold leading-none text-[#800000]">{displayName}</span>
              <span className="block text-xs font-medium leading-none text-[#800000]/70">{profile?.roles?.[0] || 'Owner'}</span>
            </span>
          </button>

          {isProfileMenuOpen && (
            <div
              id="account-menu"
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#ebd5da] bg-white py-1 shadow-lg"
            >
              <div className="border-b border-[#ebd5da] bg-[#fdf5f6] px-4 py-3">
                <p className="truncate text-sm font-bold text-[#800000]">{displayName}</p>
                <p className="truncate text-xs font-medium text-[#800000]/70">{user?.email || 'Signed-in account'}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#800000] transition-colors hover:bg-[#fdf5f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#800000]"
              >
                <Settings aria-hidden="true" className="h-4 w-4" />
                Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  void logout();
                }}
                className="flex w-full items-center gap-2 border-t border-[#ebd5da] px-4 py-2.5 text-left text-sm font-semibold text-[#800000] transition-colors hover:bg-[#fee8eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#800000]"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
