import React from 'react';
import { useRouter } from 'next/navigation';

const TopMiddle: React.FC = () => {
  const router = useRouter();
  const goToPage = (page: string) => {
    router.push(page);
  };
  return (
    <div className="flex items-center">
      <span onClick={() => goToPage('profile')} className="text-gray-700 hover:text-gray-900 px-3 py-2">Profile</span>
      <span onClick={() => goToPage('list')} className="text-gray-700 hover:text-gray-900 px-3 py-2 border-b-2 border-blue-500">Explore</span>
    </div>
  );
};

export default TopMiddle;