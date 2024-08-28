// utils/contract.ts


import { Provider, Contract, Account, constants, shortString, uint256, number, BigNumberish } from "starknet";
import BN from 'bn.js';
import bs58 from 'bs58';
import CONTRACT_ABI from './abi.json';

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x001e62036b313b16b815111c54dbd82edae3989bb3d15763823732971d6c6dd9";

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

export function getContract(provider: Provider) {
  return new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
}

export async function registerUser(provider: Provider, username: string, email: string, bio: string, account) {
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

export async function updateProfile(provider: Provider, username: string, email: string, bio: string) {
  const contract = getContract(provider);
  const result = await contract.update_profile(username, email, bio);
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