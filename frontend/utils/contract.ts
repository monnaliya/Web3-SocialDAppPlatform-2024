// utils/contract.ts

import { Contract, Provider, shortString } from "starknet";
import { uploadToIPFS } from './uploadToIPFS';

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x06d32ae8ad1dc57f42cdfa13ca5ff8a4e08d79689e5c70f91f3db31be568f7cb";
const CONTRACT_ABI = [
  {
    type: "function",
    name: "register_user",
    inputs: [
      { name: "username", type: "felt252" },
      { name: "email", type: "felt252" },
      { name: "bio", type: "felt252" },
      { name: "profile_image", type: "felt252" }
    ],
    outputs: [],
    stateMutability: "external"
  },
  {
    type: "function",
    name: "get_user",
    inputs: [
      { name: "address", type: "felt252" }
    ],
    outputs: [
      { name: "user", type: "User" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "update_profile",
    inputs: [
      { name: "username", type: "felt252" },
      { name: "email", type: "felt252" },
      { name: "bio", type: "felt252" },
      { name: "profile_image", type: "felt252" }
    ],
    outputs: [],
    stateMutability: "external"
  },
  {
    type: "function",
    name: "create_post",
    inputs: [
      { name: "title", type: "felt252" },
      { name: "content", type: "felt252" },
      { name: "image", type: "felt252" }
    ],
    outputs: [{ name: "post_id", type: "u64" }],
    stateMutability: "external"
  },
  {
    type: "function",
    name: "get_posts",
    inputs: [],
    outputs: [{ name: "posts", type: "Post[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "like_post",
    inputs: [{ name: "post_id", type: "u64" }],
    outputs: [],
    stateMutability: "external"
  },
  {
    type: "function",
    name: "add_comment",
    inputs: [
      { name: "post_id", type: "u64" },
      { name: "content", type: "felt252" }
    ],
    outputs: [{ name: "comment_id", type: "u64" }],
    stateMutability: "external"
  },
  {
    type: "function",
    name: "get_comments",
    inputs: [{ name: "post_id", type: "u64" }],
    outputs: [{ name: "comments", type: "Comment[]" }],
    stateMutability: "view"
  },
  {
    type: "struct",
    name: "User",
    members: [
      { name: "address", type: "felt252" },
      { name: "username", type: "felt252" },
      { name: "email", type: "felt252" },
      { name: "bio", type: "felt252" },
      { name: "profile_image", type: "felt252" },
      { name: "registered", type: "bool" }
    ]
  },
  {
    type: "struct",
    name: "Post",
    members: [
      { name: "id", type: "u64" },
      { name: "title", type: "felt252" },
      { name: "content", type: "felt252" },
      { name: "image", type: "felt252" },
      { name: "author", type: "felt252" },
      { name: "timestamp", type: "u64" },
      { name: "likes", type: "u64" }
    ]
  },
  {
    type: "struct",
    name: "Comment",
    members: [
      { name: "id", type: "u64" },
      { name: "post_id", type: "u64" },
      { name: "author", type: "felt252" },
      { name: "content", type: "felt252" },
      { name: "timestamp", type: "u64" }
    ]
  }
];

function stringToFelt252(str: string): string {
  return shortString.encodeShortString(str);
}

export function getContract(provider: Provider) {
  return new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
}

export async function registerUser(provider: Provider, username: string, email: string, bio: string, profileImage: string) {
  const contract = getContract(provider);
  const result = await contract.register_user(username, email, bio, profileImage);
  return result;
}

export async function updateProfile(provider: Provider, username: string, email: string, bio: string, profileImage: string) {
  const contract = getContract(provider);
  const result = await contract.update_profile(username, email, bio, profileImage);
  return result;
}

export async function createPost(provider: Provider, content: string): Promise<void>  {
  const contract = getContract(provider);

  // Upload content json to IPFS
  const contentHash = await uploadToIPFS(content);
  // Convert hash to felt252
  const contentHashFelt = shortString.encodeShortString(contentHash);

  try {
    const result = await contract.create_post(contentHashFelt);
    return result;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function getPosts(provider: Provider) {
  const contract = getContract(provider);
  const result = await contract.get_posts();
  return result.map((post: any) => ({
    id: post.id.toNumber(),
    title: post.title,
    content: post.content,
    image: post.image,
    author: post.author,
    timestamp: post.timestamp.toNumber(),
    likes: post.likes.toNumber(),
  }));
}

export async function likePost(provider: Provider, postId: number) {
  const contract = getContract(provider);
  const result = await contract.like_post(postId);
  return result;
}

export async function addComment(provider: Provider, postId: number, content: string) {
  const contract = getContract(provider);
  const result = await contract.add_comment(postId, content);
  return result;
}

export async function getComments(provider: Provider, postId: number) {
  const contract = getContract(provider);
  const result = await contract.get_comments(postId);
  return result.map((comment: any) => ({
    id: comment.id.toNumber(),
    postId: comment.post_id.toNumber(),
    author: comment.author,
    content: comment.content,
    timestamp: comment.timestamp.toNumber(),
  }));
}