// app/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConnect, useAccount } from "@starknet-react/core";
import { InjectedConnector } from "@starknet-react/core";
import RegisterPrompt from './components/RegisterPrompt';

export default function Home() {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const [isPromptVisible, setIsPromptVisible] = useState(false);


  useEffect(() => {
    if (isConnected && address) {
      console.log("Connected:", address);
      setIsConnecting(false);
    }
  }, [isConnected, address]);

  const connectWallet = async () => {
    if (isConnected) {
      console.log("Already connected:", address);
      return;
    }

    setIsConnecting(true);

    if (connected && !isRegistered) {
      setIsPromptVisible(true);
    }

    try {
      console.log("Connectors Available: ", connectors);
      const availableConnector = connectors.find((c) => c instanceof InjectedConnector);
      console.log("Selected Connector: ", availableConnector);

      if (availableConnector) {
        console.log("Attempting to connect...");
        await connect({ connector: availableConnector });
        console.log("Connection initiated");

        // Wait for a short time to allow the connection to be established
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (isConnected && address) {
          console.log("Connection successful", address);
        } else {
          throw new Error("Connection failed");
        }
      } else {
        throw new Error("No available connectors");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error instanceof Error) {
        alert(`Failed to connect wallet: ${error.message}`);
      } else {
        alert("An unknown error occurred while connecting the wallet.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const goToPage = (page: string) => {
    router.push(page);
  };

  const handleRegister = () => {
    setIsPromptVisible(false);
    // Redirect or show registration page
    goToPage('/register');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center p-4">
        <div>
          <img src="/logo.png" alt="Logo" className="logo w-12 h-12" /> 
          <span className='ml-5 font-semibold'>Social DApp Platform</span>
        </div>
        
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          {isConnecting ? "Connecting..." : isConnected ? `Disconnect ${address?.slice(0,6)}...` : "Connect Wallet"}
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 mirror-title">Web3-SocialDAppPlatform-2024</h1>
          <p className="text-lg text-gray-500 mirror-subtitle">
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
      {isPromptVisible && (
          <RegisterPrompt
              onClose={() => setIsPromptVisible(false)}
              onRegister={handleRegister}
          />
      )}
    </div>
  );
}