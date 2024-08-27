// utils/contract.ts


import { Provider, Contract, Account, constants, shortString, uint256, number } from "starknet";
import BN from 'bn.js';
import bs58 from 'bs58';
import CONTRACT_ABI from './abi.json';

function ipfsHashToTwoFelt252(ipfsHash: string): [string, string] {
  try {
    // Remove the 'Qm' prefix if it exists
    const hash = ipfsHash.startsWith('Qm') ? ipfsHash.slice(2) : ipfsHash;
    
    // Convert the base58 hash to bytes
    const bytes = bs58.decode(hash);
    
    // Convert bytes to hex
    const hex = '0x' + Buffer.from(bytes).toString('hex');
    
    // Convert hex to BigNumber
    const bn = new BN(hex.slice(2), 16);
    
    // felt252 max value (2^251 - 1)
    const felt252Max = new BN(2).pow(new BN(251)).sub(new BN(1));
    
    // Split into two felt252 values
    const hashLow = bn.mod(felt252Max);
    const hashHigh = bn.div(felt252Max);

    return [hashHigh.toString(), hashLow.toString()];
  } catch (error) {
    console.error('Error converting IPFS hash:', error);
    throw error;
  }
}
import { uploadToIPFS } from './uploadToIPFS';

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x05f14f15dbe03bbf3a18b0b446a613a93f5229a77bc52718cba7e748556f4705";

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


export async function createPost(provider: Provider, ipfsHash: string, account)  {
  const contract = getContract(provider);

  try {
    const [hashHigh, hashLow] = ipfsHashToTwoFelt252(ipfsHash);
    const hashHighUint256 = uint256.bnToUint256(BigInt(hashHigh));
    const hashLowUint256 = uint256.bnToUint256(BigInt(hashLow));
    
    // Use the account to execute the contract call
    const result = await account.execute({
      contractAddress: contract.address,
      entrypoint: "create_post",
      calldata: [hashHighUint256.low, hashHighUint256.high, hashLowUint256.low, hashLowUint256.high]
    });

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