"use client";

import React from 'react';
import TopLeft from './TopLeft';
import TopRight from './TopRight';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <TopLeft />
        <TopRight />
      </header>
      <main className="flex-grow mt-20"> {/* mt-20 to ensure the main content is not hidden behind the fixed header */}
        {children}
      </main>
    </div>
  );
};

export default Layout;
