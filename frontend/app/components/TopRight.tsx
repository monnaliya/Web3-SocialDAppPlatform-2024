  import React, { useState, useEffect } from 'react';
  import { useConnect, useAccount, useProvider, useDisconnect } from '@starknet-react/core';
  import { useRouter } from 'next/navigation';
  import { isRegistered } from '@/utils/contract'; // Assume this function exists in your contract utils

  const TopRight: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { account, address, status, isConnected } = useAccount();
  const { provider } = useProvider();
  const router = useRouter();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { disconnect } = useDisconnect();

  useEffect(() => {
    const checkRegistration = async () => {
      if (status === 'connected' && provider && address) {
        const registered = await isRegistered(address, account);
        setRegistered(registered);
      }
    };

    checkRegistration();
  }, [status, provider, address]);

  const handleConnect = async () => {
    try {
      await connect(); // Assuming the first connector is the one we want to use
      const availableConnector = connectors.find((c) => c.available());
      if (availableConnector) {
        await connect({ connector: availableConnector });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error("No available connectors");
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    if (account) {
      await disconnect();
    }
    setShowProfileMenu(false);
  };

  const handleCreateClick = () => {
    router.push('/create');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  if (status === 'disconnected') {
    return (
      <button
        onClick={handleConnect}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Connect Wallet
      </button>
    );
  }

  if (status === 'connected' && !isRegistered) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">Not Registered</p>
        <p>You need to register to use all features.</p>
        <button
          onClick={handleRegisterClick}
          className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">

      <button
        onClick={handleCreateClick}
        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        + Create
      </button>

      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Profile
        </button>
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <p className="px-4 py-2 text-sm text-gray-700">
              Address: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <button
              onClick={handleProfileClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              View Profile
            </button>
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

  export default TopRight;