"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const router = useRouter();

  const connectWallet = async () => {
    // Wallet connection logic (MetaMask example)
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const goToPage = (page: string) => {
    router.push(page);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-end p-4">
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Web3-SocialDAppPlatform-2024</h1>
          <p className="text-lg text-gray-500">
            A decentralized social media platform where users control their data and privacy.
          </p>

          <div className="mt-8">
            <button
              onClick={() => goToPage("/list")}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              View Posts
            </button>

            <button
              onClick={() => goToPage("/create")}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Create Post
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}