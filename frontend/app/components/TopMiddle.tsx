import React from 'react';
import { useGoToPage } from '@/utils/navigation';

const TopMiddle: React.FC = () => {
  const goToPage = useGoToPage();
  return (
    <div className="flex items-center">
      <span onClick={() => goToPage('profile')} className={`text-gray-700 hover:text-gray-900 px-3 py-2 ${window.location.pathname === '/profile' ? 'border-b-2 border-blue-500' : ''}`}>Profile</span>
      <span onClick={() => goToPage('/')} className={`text-gray-700 hover:text-gray-900 px-3 py-2 ${window.location.pathname === '/' ? 'border-b-2 border-blue-500' : ''}`}>Explore</span>
    </div>
  );
};

export default TopMiddle;