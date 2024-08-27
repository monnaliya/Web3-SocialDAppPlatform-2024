// utils/fetchFromIPFS.ts
import axios from 'axios';

export async function fetchFromIPFS(hash: string): Promise<any> {
  try {
    const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
}
