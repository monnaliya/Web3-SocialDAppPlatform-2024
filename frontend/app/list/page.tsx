"use client";

import React, { useState, useEffect } from "react";
import { useProvider, useAccount } from "@starknet-react/core";
import { getPosts } from '@/utils/contract';
import PostList from "../components/PostList";
import { mockPosts } from '@/mockData/posts';
import Layout from "../components/Layout";
import { PostCardProps } from "@/utils/types";

const ListPage: React.FC = () => {
  const { provider } = useProvider();
  const { address, isConnected, account } = useAccount();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [provider, isConnected]);

  const handlePost = (post) => {
    return {
      id: post.id ? post.id : 'xx',
      imageUrl: post.imageUrl ? post.imageUrl : 'xx',
      title: post.title ? post.title : 'xx',
      author: post.author ? post.author : 'xx',
      createdAt: post.createAt ? post.createAt : '',
      content: post.content ? post.content : '',
      likes: post.likes ? post.likes : '',
      commends: post.comments ? post.comments : ''
    };
  }

  const fetchPosts = async () => {
    try {
      const postHashes = await getPosts();
      const fetchedPosts = await Promise.all(postHashes.map(async (data) => {
        const content = await fetchFromIPFS(data.hash);
        const post = handlePost({ ...data, ...content })
        return post;
      }));
      console.log('--fetchedPosts---', fetchedPosts)
      // setPosts(fetchedPosts);
      setPosts(mockPosts);
      fetchedPosts.forEach(post => fetchComments(post.id));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  );
}

export default ListPage;