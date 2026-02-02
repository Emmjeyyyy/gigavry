import React, { PropsWithChildren } from 'react';

export const AppShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      <main className="flex-grow z-10 container mx-auto px-4 pb-20 pt-4 max-w-7xl">
        {children}
      </main>
      <footer className="z-10 py-8 text-center text-cocoa/40 font-mono text-xs">
        <p>GigaGivry System // v1.0.0</p>
        <p className="mt-2">Powered by FreeToGame & GamerPower</p>
      </footer>
    </div>
  );
};