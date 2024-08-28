import { Provider } from "starknet";

const provider = new Provider({
  sequencer: {
    network: 'goerli-alpha',
    baseUrl: 'http://localhost:3000/api/starknet' // This URL matches the proxy setup in next.config.mjs
  }
});

export default provider;
