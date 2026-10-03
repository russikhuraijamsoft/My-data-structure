import React from 'react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-[#800000] z-50">
      <div className="w-16 h-16 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mb-8"></div>
      <h1 className="text-3xl font-bold tracking-tight text-[#800000] mb-2">TalkOS</h1>
      <p className="text-[#800000]/70 font-semibold tracking-wide text-sm">ENTERPRISE RESTAURANT OS</p>
    </div>
  );
}
