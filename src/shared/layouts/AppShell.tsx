import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isFullScreenRoute = location.pathname.startsWith('/kds') || location.pathname.startsWith('/pos');

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#800000] flex font-sans selection:bg-[#800000] selection:text-white">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className={`flex-1 overflow-y-auto bg-[#ffffff] ${isFullScreenRoute ? 'p-2 md:p-4' : 'p-4 lg:p-8'}`}>
          <div className={`mx-auto h-full ${isFullScreenRoute ? 'max-w-none' : 'max-w-7xl'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
