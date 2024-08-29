import React from 'react';

const TopMiddle: React.FC = () => {
  return (
    <div className="flex items-center">
      <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2">Profile</a>
      <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 border-b-2 border-blue-500">Explore</a>
    </div>
  );
};

export default TopMiddle;