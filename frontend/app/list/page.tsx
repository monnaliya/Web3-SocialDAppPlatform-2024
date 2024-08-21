export default function ListPage() {
    const mockPosts = [
      {
        id: 1,
        title: "First Decentralized Post",
        time: "2024-08-21 10:00 UTC",
        content: "This is the content of the first post stored on a decentralized network.",
        image: "https://via.placeholder.com/150",
        likes: 12,
      },
      {
        id: 2,
        title: "Exploring Web3 Social Platforms",
        time: "2024-08-22 14:30 UTC",
        content: "Web3 social platforms are changing how we interact online. Here's how...",
        image: "https://via.placeholder.com/150",
        likes: 34,
      },
      {
        id: 3,
        title: "New Features in Web3-SocialDAppPlatform-2024",
        time: "2024-08-23 09:45 UTC",
        content: "Today we released some new features that enhance user experience...",
        image: "https://via.placeholder.com/150",
        likes: 20,
      },
    ];
  
    return (
      <div className="p-8">
        <h1 className="text-3xl mb-6">List of Posts</h1>
        <div className="space-y-6">
          {mockPosts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{post.time}</p>
              <img src={post.image} alt={post.title} className="w-full h-auto mb-4 rounded" />
              <p className="mb-4">{post.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{post.likes} Likes</span>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400">
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }