export default function ListPage() {
    const mockPosts = [
      {
        id: 1,
        title: "First Decentralized Post",
        time: "2024-08-21 10:00 UTC",
        content: "This is the content of the first post stored on a decentralized network.",
        image: "https://via.placeholder.com/150",
        likes: 12,
        walletAddress: "0xAbc123...def456"
      },
      {
        id: 2,
        title: "Exploring Web3 Social Platforms",
        time: "2024-08-22 14:30 UTC",
        content: "Web3 social platforms are changing how we interact online. Here's how...",
        image: "https://via.placeholder.com/150",
        likes: 34,
        walletAddress: "0xDef456...ghi789"
      },
      {
        id: 3,
        title: "New Features in Web3-SocialDAppPlatform-2024",
        time: "2024-08-23 09:45 UTC",
        content: "Today we released some new features that enhance user experience...",
        image: "https://via.placeholder.com/150",
        likes: 20,
        walletAddress: "0xGhi789...jkl012"
      },
    ];
  
    return (
      <div className="p-8">
        <h1 className="text-3xl mb-6">List of Posts</h1>
        <div className="space-y-6">
          {mockPosts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p>{post.time}</p>
              <p>Creator: {post.walletAddress}</p>
              <img src={post.image} alt={post.title} className="my-4" />
              <p>{post.content}</p>
              <p>Likes: {post.likes}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }