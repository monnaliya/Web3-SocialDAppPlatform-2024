// app/create/page.tsx

"use client";

import React, { useState, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps} from 'slate-react';
import { useRouter } from 'next/navigation';
import { useProvider, useAccount } from "@starknet-react/core";
import { createPost } from '@/utils/contract';
import { uploadToIPFS } from '@/utils/uploadToIPFS';
import Layout from "../components/Layout";

const CreatePage: React.FC = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { provider } = useProvider();
  const { address, isConnected, account } = useAccount();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !isConnected) {
      console.error("Wallet not connected");
      return;
    }
    try {
      const serializedContent = JSON.stringify(content);
      // const contentBlob = new Blob([serializedContent], { type: 'application/json' });
      // const contentHash = await uploadToIPFS(contentBlob);
      // // Split the hash into high and low parts as before
      // const hashBigInt = BigInt(`0x${contentHash}`);
      // const hashHigh = (hashBigInt >> 128n).toString();
      // const hashLow = (hashBigInt & ((1n << 128n) - 1n)).toString();
      // await createPost(hashHigh, hashLow, title, account);
      const imageUrl = imageFile ? await uploadToIPFS(imageFile) : null
      const postContent = {
        title,
        content: serializedContent,
        imageUrl: imageUrl
      };
      const contentHash = await uploadToIPFS(postContent);
      await createPost(contentHash, account)
      router.push('/list');
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'paragraph':
        return <p {...props.attributes}>{props.children}</p>;
      // Add more cases for other element types (e.g., headings, lists)
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);
  
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <span {...props.attributes}>{props.children}</span>;
  }, []);

  return (
    <Layout>
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
            <Slate editor={editor} initialValue={content} onChange={setContent}>
              <Editable
                placeholder="Write your content here..."
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Slate>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full"
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
    </Layout>
  );
}

export default CreatePage;