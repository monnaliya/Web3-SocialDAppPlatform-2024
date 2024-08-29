import React from 'react';
import { useGoToPage } from '@/utils/navigation';

const TopLeft: React.FC = () => {
  const goToPage = useGoToPage();
  return (
    <div className="flex items-center" onClick={() => goToPage('/')}>
      <img src="/logo.png" alt="Logo" className="logo w-12 h-12 rounded-full" />
      <span className="ml-5 ml-2 text-xl font-semibold">Social DApp Platform</span>
    </div>
  );
};

export default TopLeft;