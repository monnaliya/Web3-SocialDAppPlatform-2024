"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProvider, useAccount } from "@starknet-react/core";
import { getPosts, likePost } from '../../utils/contract';
interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  likes: number;
  timestamp: number;
  author: string;
  authorDID: string;
}

export default function ListPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { provider } = useProvider();
    const { address } = useAccount();

    useEffect(() => {
      if (provider) {
        fetchPosts();
      }
    }, [provider]);

    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts(provider);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const mockPosts = [
      {
        id: 1,
        title: "First Decentralized Post",
        timestamp: "2024-08-21 10:00 UTC",
        content: "This is the content of the first post stored on a decentralized network.",
        image: "https://via.placeholder.com/150",
        likes: 12,
        author: 'xx',
        authorDID: "0xAbc123...def456"
      },
      {
        id: 2,
        title: "Exploring Web3 Social Platforms",
        timestamp: "2024-08-22 14:30 UTC",
        content: "Web3 social platforms are changing how we interact online. Here's how...",
        image: "https://via.placeholder.com/150",
        likes: 34,
        author: 'xx',
        authorDID: "0xDef456...ghi789"
      },
      {
        id: 3,
        title: "New Features in Web3-SocialDAppPlatform-2024",
        timestamp: "2024-08-23 09:45 UTC",
        content: "Today we released some new features that enhance user experience...",
        image: "https://via.placeholder.com/150",
        likes: 20,
        author: 'xx',
        authorDID: "0xGhi789...jkl012"
      },
    ];

    const handleLike = async (postId: number) => {
      if (!provider || !address) {
        console.error("Wallet not connected");
        return;
      }
      try {
        await likePost(provider, postId);
        fetchPosts(); // Refresh posts after liking
      } catch (error) {
        console.error("Error liking post:", error);
      }
    };

    return (
      <div className="p-8">
        <h1 className="text-3xl mb-6">List of Posts</h1>
        <div className="space-y-6">
          {mockPosts.map((post, index) => (
            <div key={post.id} className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              {post.image && <img src={post.image} alt={post.title} className="w-full mb-2" />}
              <p className="text-gray-800 mb-2">{post.content}</p>
              <p className="text-sm text-gray-500">Posted by: {post.author}</p>
              <p className="text-sm text-gray-500">DID: {post.authorDID}</p>
              <p className="text-sm text-gray-500">{new Date(post.timestamp * 1000).toLocaleString()}</p>
              <div className="flex justify-between items-center">
                <button 
                    className="flex items-center text-blue-500" 
                    onClick={() => handleLike(post.id)}
                >
                    <span className="mr-2">❤️</span> 
                    {post.likes}
                </button>
            </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
      </div>
    );
  }