import React from 'react';

const TopLeft: React.FC = () => {
  return (
    <div className="flex items-center">
      <img src="/logo.png" alt="Logo" className="logo w-12 h-12 rounded-full" />
      <span className="ml-5 ml-2 text-xl font-semibold">Social DApp Platform</span>
    </div>
  );
};

export default TopLeft;