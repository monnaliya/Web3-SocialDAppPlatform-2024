"use client";

import { StarknetConfig, InjectedConnector, publicProvider } from "@starknet-react/core";
import { goerli } from "@starknet-react/chains";

const chains = [goerli];
const provider = publicProvider();

export function Providers({ children }: { children: React.ReactNode }) {
  // const chains = [goerli];
  const connectors = [
    new InjectedConnector({ options: { id: 'braavos' }}),
    new InjectedConnector({ options: { id: 'argentX' }}),
  ];

  return (
    <StarknetConfig 
      autoConnect
      connectors={connectors}
      chains={chains}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}