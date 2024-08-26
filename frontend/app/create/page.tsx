// app/create/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProvider, useAccount } from "@starknet-react/core";
import { createPost } from '../../utils/contract';
import { uploadToIPFS } from '../../utils/uploadToIPFS';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { provider } = useProvider();
  const { address, isConnected } = useAccount();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!provider || !isConnected) {
      console.error("Wallet not connected");
      return;
    }
    try {
      const imageUrl = file ? await uploadToIPFS(file) : null;
      await createPost(provider, title, content, imageUrl || '');
      router.push('/list');
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadToIPFS(file);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input 
            type="file" 
            onChange={handleFileUpload}
            className="mt-1 block w-full"
          />
        </div>

        {imageUrl && (
          <div>
            <p>File uploaded to IPFS:</p>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {imageUrl}
            </a>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}