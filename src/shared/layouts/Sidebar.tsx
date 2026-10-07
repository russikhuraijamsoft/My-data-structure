import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { getVisibleNavigation } from './navigation';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { profile } = useAuth();
  const filteredNav = getVisibleNavigation(profile?.roles);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 border-0 bg-[#42000c]/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="sidebar"
        aria-label="Main navigation"
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#ebd5da] bg-white
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#ebd5da] px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#800000] shadow-xs">
              <span className="text-xl font-bold leading-none text-white">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#800000]">TalkOS</span>
              <span className="-mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#800000]/70">Enterprise</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#800000] transition-colors hover:bg-[#fdf5f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] lg:hidden"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Restaurant modules" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#800000] focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-[#800000] font-bold text-white shadow-xs'
                    : 'text-[#800000] hover:bg-[#fdf5f6] hover:text-[#800000]'
                }`
              }
            >
              <item.icon aria-hidden="true" className="h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#ebd5da] p-4">
          <div className="rounded-xl border border-[#ebd5da] bg-[#fdf5f6] p-3.5">
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#800000]/80">Branch</h4>
            <p className="truncate text-sm font-bold text-[#800000]">Main Downtown</p>
            <p className="mt-0.5 text-xs text-[#800000]/70">Terminal 01</p>
          </div>
        </div>
      </aside>
    </>
  );
}
