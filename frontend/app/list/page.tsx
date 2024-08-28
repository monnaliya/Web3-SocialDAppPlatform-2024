// app/list/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProvider, useAccount } from "@starknet-react/core";
import { getPosts, likePost, getComments, addComment } from '../../utils/contract';
import { fetchFromIPFS } from '../../utils/fetchFromIPFS';

interface Post {
  id: number;
  hash: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likes: number;
  timestamp: number;
  author: string;
}

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  timestamp: number;
}

export default function ListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { provider } = useProvider();
  const { address, isConnected, account } = useAccount();
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [newComments, setNewComments] = useState<{ [postId: number]: string }>({});

  useEffect(() => {
    if (provider) {
      fetchPosts();
    }
  }, [provider]);

  const fetchPosts = async () => {
    try {
      const postHashes = await getPosts();
      const fetchedPosts = await Promise.all(postHashes.map(async (data) => {
        const content = await fetchFromIPFS(data.hash);
        const post = { ...data, ...content }
        return post;
      }));
      console.log('--fetchedPosts---', fetchedPosts)
      setPosts(fetchedPosts);
      fetchedPosts.forEach(post => fetchComments(post.id));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchComments = async (postId: number) => {
    try {
      const fetchedComments = await getComments(postId);
      setComments(prev => ({ ...prev, [postId]: fetchedComments }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async (postId: number) => {
    if (!provider || !isConnected) {
      console.error("Wallet not connected");
      return;
    }
    try {
      await likePost(postId, account);
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!provider || !isConnected) {
      console.error("Wallet not connected");
      return;
    }
    try {
      await addComment(postId, newComments[postId]);
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">List of Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">{post.title}</h2>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full mb-2" />}
            <p className="text-gray-800 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">Posted by: {post.author.slice(0, 6)}...{post.author.slice(-4)}</p>
            {/* <p className="text-sm text-gray-500">{new Date(post.timestamp * 1000).toLocaleString()}</p> */}
            <div className="flex justify-between items-center mt-2">
              <button 
                className="flex items-center text-blue-500" 
                onClick={() => handleLike(post.id)}
              >
                <span className="mr-2">❤️</span> 
                {Number(post.likes)}
              </button>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Comments</h3>
              {comments[post.id]?.map((comment) => (
                <div key={comment.id} className="bg-gray-100 p-2 rounded mt-2">
                  <p>{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    {/* By: {comment.author} on {new Date(comment.timestamp * 1000).toLocaleString()} */}
                  </p>
                </div>
              ))}
              <div className="mt-2">
                <textarea
                  value={newComments[post.id] || ''}
                  onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="mt-2 bg-blue-500 text-white py-1 px-2 rounded text-sm"
                >
                  Add Comment
                </button>
              </div>
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