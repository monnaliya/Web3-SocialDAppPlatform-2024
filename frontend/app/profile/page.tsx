// app/profile/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProvider, useAccount } from "@starknet-react/core";
import { registerUser, updateProfile } from '../../utils/contract';

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();
  const { provider } = useProvider();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
    // TODO: Fetch current user profile if it exists
  }, [isConnected, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !address) {
      console.error("Wallet not connected");
      return;
    }
    try {
      // Determine if this is a new registration or an update
      const result = await (isConnected ? updateProfile : registerUser)(
        provider,
        username,
        email,
        bio
      );
      console.log("Profile updated:", result);
      router.push('/');
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">{isConnected ? 'Update Profile' : 'Register'}</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {isConnected ? 'Update Profile' : 'Register'}
        </button>
      </form>
    </div>
  );
}