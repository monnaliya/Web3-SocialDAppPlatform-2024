import { create } from 'ipfs-http-client';

const projectId = 'YourInfuraProjectID'; // Replace with your Infura Project ID
const projectSecret = 'YourInfuraProjectSecret'; // Replace with your Infura Project Secret
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});