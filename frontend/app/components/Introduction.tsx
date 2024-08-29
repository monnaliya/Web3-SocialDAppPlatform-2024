import React from 'react';
import { mockPosts } from '@/mockData/posts';

const Introduction: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center flex-col lg:flex-row">
        <div className="text-center lg:w-1/2 pr-8">
          <h1 className="font-bold mirror-title text-2xl mb-2">Web3-SocialDAppPlatform-2024</h1>
          <p className="text-gray-600 mb-6 text-lg mirror-subtitle">
            A decentralized social media platform where users control their data and privacy.
          </p>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-xl font-semibold mb-2">Your inbox is empty... for now</p>
            <p className="text-gray-600">
              Subscribe to creators and <span className="text-orange-500">collectors(收藏家)</span> to begin your{' '}
              <span className="text-orange-500">journey(旅程)</span>.
            </p>
          </div>
        </div>

        {/* List 部分 */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 " >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">List</h2>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">View All</a>
            </div>
            <p className="text-gray-600 mb-4">
              Subscribe to receive updates whenever a new entry is created or collected.
            </p>
            {/* 用户建议列表 */}
            <ul className="space-y-4 overflow-y-auto">
              {mockPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={post.imageUrl} alt={post.title} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-semibold">{post.title}</p>
                      <p className="text-sm text-gray-500">{post.content}</p>
                    </div>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full text-sm">
                    Subscribe
                  </button>
                </li>
              ))}
            </ul>
            <button className="w-full mt-6 bg-blue-100 text-blue-600 font-semibold py-2 px-4 rounded hover:bg-blue-200">
              Subscribe to All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;