// utils/uploadToIPFS.ts

import { pinFileToIPFS } from '../lib/ipfs';

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const ipfsUrl = await pinFileToIPFS(file);
    console.log('File uploaded to IPFS:', ipfsUrl);
    return ipfsUrl;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}