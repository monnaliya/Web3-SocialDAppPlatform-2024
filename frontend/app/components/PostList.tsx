import React from 'react';
import FlexiblePost from './FlexiblePost';
import { Post, PostCardProps } from '../../utils/types';

const PostList: React.FC<PostCardProps[]> = ({posts}) => {
  return (
    posts.length ? (
      <div>
        <div className="container mx-auto px-4">
          {/* First post (horizontal) */}
          <div className="mb-8">
            <FlexiblePost post={posts[0] ? posts[0] : {}} isVertical={false} />
          </div>
      
          {/* Remaining posts (vertical, 3 per row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post: Post) => (
              <FlexiblePost key={post.id} post={post} isVertical={true} />
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div>empty</div>
    )
  );
};

export default PostList;