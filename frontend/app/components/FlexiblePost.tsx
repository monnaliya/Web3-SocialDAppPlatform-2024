import React from 'react';
import { format } from 'date-fns';

import { Post } from '@/utils/types';

interface PostCardProps {
  post: Post,
  isVertical: boolean
}

const FlexiblePost: React.FC<PostCardProps> = ({post: {id, imageUrl, title, author, createdAt, content, likes, comments}, isVertical: isVertical}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isVertical ? 'flex flex-col' : 'flex'}`}>
      <div className={`${isVertical ? 'w-full' : 'w-1/2'}`}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className={`${isVertical ? 'p-6' : 'w-1/2 p-6'}`}>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="mr-4">{author}</span>
          <span>{createdAt ? createdAt.toString() : ''}</span>
          {/* <span>{format(createdAt, 'MMMM d, yyyy')}</span> */}
        </div>
        <p className="text-gray-700 mb-4">{content}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{likes} likes</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{comments} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlexiblePost;