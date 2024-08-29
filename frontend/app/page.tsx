// app/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from './components/Layout';
import RegisterPrompt from './components/RegisterPrompt';
import { useConnect, useAccount } from "@starknet-react/core";

export default function Home() {
  const router = useRouter();
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const { address, isConnected } = useAccount();

  const goToPage = (page: string) => {
    router.push(page);
  };

  const handleRegister = () => {
    setIsPromptVisible(false);
    // Redirect or show registration page
    goToPage('/register');
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 mirror-title">Web3-SocialDAppPlatform-2024</h1>
            <p className="text-lg text-gray-500 mirror-subtitle">
              A decentralized social media platform where users control their data and privacy.
            </p>
          </div>
          {
            isConnected && (
              <div className="mt-8">
                <button
                  onClick={() => goToPage("/list")}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  View Posts
                </button>
              </div>
            )
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