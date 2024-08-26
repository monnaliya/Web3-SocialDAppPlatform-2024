// utils/uploadToIPFS.ts

import { ipfsClient } from '../lib/ipfs';

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const added = await ipfsClient.add(file);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}