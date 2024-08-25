"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConnect, useDisconnect, useAccount } from "@starknet-react/core";

export default function Home() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();

  const connectWallet = async () => {
    try {
      const availableConnector = connectors.find((c) => c.available());
      if (availableConnector) {
        await connect({ connector: availableConnector });
      } else {
        console.error("No available connectors");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const goToPage = (page: string) => {
    router.push(page);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-end p-4">
        <button
          onClick={isConnected ? disconnectWallet : connectWallet}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {isConnected ? `Disconnect ${address?.slice(0,6)}...` : "Connect Wallet"}
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