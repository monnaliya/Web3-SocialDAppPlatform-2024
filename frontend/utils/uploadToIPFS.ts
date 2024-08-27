// utils/uploadToIPFS.ts

import { pinFileToIPFS } from '../lib/ipfs';

export async function uploadToIPFS(content: any): Promise<string> {
  try {
    const contentString = JSON.stringify(content);
    const contentBlob = new Blob([contentString], { type: 'application/json' });
    const file = new File([contentBlob], 'content.json', { type: 'application/json' });
    const ipfsUrl = await pinFileToIPFS(file);
    // Extract and return only the hash
    const hash = ipfsUrl.split('/').pop() || '';
    return hash;
  } catch (error) {
    console.error('Error uploading content to IPFS:', error);
    throw error;
  }
}