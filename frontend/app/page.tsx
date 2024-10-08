// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './components/Layout';
import RegisterPrompt from './components/RegisterPrompt';
import { useConnect, useAccount } from "@starknet-react/core";
import Introduction from './components/Introduction';
import PostList from './components/PostList';
import { useGoToPage } from '@/utils/navigation';
import { mockPosts } from '@/mockData/posts';

export default function Home() {
  const router = useRouter();
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const { address, isConnected } = useAccount();

  const goToPage = useGoToPage();

  const handleRegister = () => {
    setIsPromptVisible(false);
    // Redirect or show registration page
    goToPage('/register');
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <main className="flex-grow flex items-center justify-center">
          {
            isConnected ? <PostList posts={mockPosts}/> : <Introduction posts={mockPosts}/>
          }
        </main>
        {isPromptVisible && (
          <RegisterPrompt
              onClose={() => setIsPromptVisible(false)}
              onRegister={handleRegister}
          />
        )}
      </div>
    </Layout>
  );
}