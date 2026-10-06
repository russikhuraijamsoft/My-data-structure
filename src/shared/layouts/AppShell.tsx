import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isFullScreenRoute = location.pathname.startsWith('/kds') || location.pathname.startsWith('/pos');

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex bg-[#ffffff] font-sans text-[#800000] selection:bg-[#800000] selection:text-white">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-[60] rounded-lg bg-white px-4 py-2 font-semibold text-[#800000] shadow-lg focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-[#800000]"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          isMenuOpen={isMobileMenuOpen}
          onMenuClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 overflow-y-auto bg-[#ffffff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#800000] ${isFullScreenRoute ? 'p-2 md:p-4' : 'p-4 lg:p-8'}`}
        >
          <div className={`mx-auto h-full ${isFullScreenRoute ? 'max-w-none' : 'max-w-7xl'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
