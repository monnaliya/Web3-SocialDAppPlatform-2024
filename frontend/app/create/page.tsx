"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const time = new Date().toISOString(); // Generate the current timestamp
    const likes = 0; // Initialize likes to 0
    // Handle the form submission logic here
    console.log({ title, time, content, image, likes });

    // Reset form after submission
    setTitle('');
    setContent('');
    setImage('');

    // Navigate back to the list page
    router.push('/list');
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
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

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