"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProvider, useAccount } from "@starknet-react/core";
import { registerUser } from '../../utils/contract';
import { Account } from 'starknet';
import Layout from "../components/Layout";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const router = useRouter();
  const { provider } = useProvider();
  const { address, isConnected, account } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!provider || !isConnected) {
      console.error("Wallet not connected");
      alert("Please connect your wallet first.");
      return;
    }

    try {
      await registerUser(username, email, bio, account);
      alert("User registered successfully!");
      router.push('/');
    } catch (error) {
      console.error("Error registering user:", error);
      alert(`Failed to register user. Error: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl mb-6">Register User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default RegisterPage;