// utils/contract.ts


import { Provider, Contract, Account, constants, shortString, uint256, number, BigNumberish } from "starknet";
import { Buffer } from 'buffer';
import BN from 'bn.js';
import bs58 from 'bs58';
import provider from './provider';
import CONTRACT_ABI from './abi.json';

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x001e62036b313b16b815111c54dbd82edae3989bb3d15763823732971d6c6dd9";

function ipfsHashToTwoFelt252(ipfsHash: string): [string, string] {
  try {
    // Decode the base58 hash to bytes
    const bytes = bs58.decode(ipfsHash);
    
    // Remove the first two bytes (multihash prefix)
    const hashBytes = bytes.slice(2);
    
    // Convert bytes to BigNumber
    const bn = new BN(hashBytes);
    
    // Use bitwise operations to split into two felt252 values
    const mask = new BN(2).pow(new BN(252)).sub(new BN(1));
    const hashLow = bn.and(mask);
    const hashHigh = bn.shrn(252);
    
    return [hashHigh.toString(), hashLow.toString()];
  } catch (error) {
    console.error('Error converting IPFS hash:', error);
    throw error;
  }
}

function combineHashParts(hashHigh: string, hashLow: string): string {
  // Convert hashHigh and hashLow to BigNumber
  const highBN = new BN(hashHigh);
  const lowBN = new BN(hashLow);
  
  // Combine the two parts using bitwise operations
  const fullHashBN = highBN.shln(252).or(lowBN);
  
  // Convert to bytes (32 bytes)
  const hashBytes = fullHashBN.toArrayLike(Buffer, 'be', 32);
  
  // Add the multihash prefix for IPFS (assuming it's always Qm for IPFS v0)
  const multihashPrefix = Buffer.from([0x12, 0x20]); // 0x12 = sha2-256, 0x20 = 32 bytes length
  const fullBytes = Buffer.concat([multihashPrefix, hashBytes]);
  
  // Encode to base58
  const ipfsHash = bs58.encode(fullBytes);
  
  return ipfsHash;
}

// Helper function to convert felt252 string to BigNumber
function felt252ToBN(felt: string): BN {
  // Remove 'n' suffix if present
  const cleanFelt = felt.endsWith('n') ? felt.slice(0, -1) : felt;
  return new BN(cleanFelt);
}

export function getContract() {
  return new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
}

export async function registerUser(username: string, email: string, bio: string, account) {
  const contract = getContract(provider);
  
  if (!account) {
    throw new Error("No account connected. Please connect your wallet first.");
  }

  try {
    const usernameShort = shortString.encodeShortString(username);
    const emailShort = shortString.encodeShortString(email);
    const bioShort = shortString.encodeShortString(bio);
    const calldata: BigNumberish[] = [usernameShort, emailShort, bioShort];

    const result = await account.execute({
      contractAddress: contract.address,
      entrypoint: "register_user",
      calldata: calldata
    });

    console.log('---User registration result:', result);
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function updateProfile(username: string, email: string, bio: string) {
  const contract = getContract(provider);
  const result = await contract.update_profile(username, email, bio);
  return result;
}


export async function createPost(ipfsHash: string, account)  {
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

export async function getPosts() {
  const contract = getContract(provider);
  const result = await contract.get_posts();
  return result.map((post: any) => ({
    id: post.id,
    author: post.author,
    timestamp: post.timestamp,
    likes: post.likes,
    hash: combineHashParts(post.hash_high, post.hash_low)
  }));
}

export async function likePost(postId: number) {
  const contract = getContract(provider);
  const result = await contract.like_post(postId);
  return result;
}

export async function addComment(postId: number, content: string) {
  const contract = getContract(provider);
  const result = await contract.add_comment(postId, content);
  return result;
}

export async function getComments(postId: number) {
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