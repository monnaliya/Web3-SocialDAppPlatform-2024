import { Contract, Provider, constants } from "starknet";

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "your_contract_address_here";
const CONTRACT_ABI = []; // Your contract ABI goes here

export function getContract(provider: Provider) {
  return new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
}

export async function createPost(provider: Provider, title: string, content: string, imageUrl: string) {
    const contract = getContract(provider);
    const result = await contract.create_post(title, content, imageUrl);
    return result;
}

export async function getPosts(provider: Provider) {
    const contract = getContract(provider);
    const result = await contract.get_posts();
    return result.map((post: any) => ({
      id: post.id.toNumber(),
      title: post.title,
      content: post.content,
      image: post.image,
      likes: post.likes.toNumber(),
      timestamp: post.timestamp.toNumber(),
      author: post.author,
      authorDID: post.author_did
    }));
}

export async function likePost(provider: Provider, postId: number) {
    const contract = getContract(provider);
    const result = await contract.like_post(postId);
    return result;
}

