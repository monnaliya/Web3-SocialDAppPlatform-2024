import React from 'react';

interface Post {
  id: number;
  image: string;
  title: string;
  author: string;
  date: string;
  content: string;
  collectCount: number;
}

interface PostCardProps {
  post: Post;
  isHorizontal: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isHorizontal }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isHorizontal ? 'flex' : 'flex-col'}`}>
      <img 
        src={post.image} 
        alt={post.title} 
        className={`object-cover ${isHorizontal ? 'w-1/2 h-64' : 'w-full h-48'}`}
      />
      <div className={`p-4 ${isHorizontal ? 'w-1/2' : 'w-full'}`}>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="mr-2">{post.author}</span>
          <span>{post.date}</span>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/path-to-avatar-icon.png" alt="Avatar" className="w-6 h-6 rounded-full mr-2" />
            <span>{post.collectCount} Collected</span>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Mint(薄荷)
          </button>
        </div>
      </div>
    </div>
  );
};

const PostList: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      image: '/path-to-image1.jpg',
      title: 'Celebrating Superchain Creativity(创造力): Announcing the Winners of "We ❤️The Art"',
      author: 'The Optimism(乐观) Collective',
      date: 'March(三月) 12',
      content: 'Amidst a whirlwind of creativity(创造力), We ❤️The Art has reached its conclusion, after seeing 7,000+ submissions seize(抓住) this OPportunity to share their art...',
      collectCount: 199
    },
    // ... more posts
  ];

  return (
    <div className="container mx-auto px-4">
      {/* First post (horizontal) */}
      <div className="mb-8">
        <PostCard post={posts[0]} isHorizontal={true} />
      </div>

      {/* Remaining posts (vertical, 3 per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(1).map(post => (
          <PostCard key={post.id} post={post} isHorizontal={false} />
        ))}
      </div>
    </div>
  );
};

export default PostList;