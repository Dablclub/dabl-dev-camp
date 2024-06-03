'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { mainnet, polygonZkEvmCardona } from 'wagmi/chains';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonZkEvmCardona, mainnet],
    transports: {
      // RPC URL for each chain
      [polygonZkEvmCardona.id]: http(),
      [mainnet.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',

    // Required App Info
    appName: 'React to Web3 Bootcamp',

    // Optional App Info
    appDescription: 'React to Web3 Bootcamp',
    appUrl: 'https://localhost:3000', // your app's url
    appIcon: 'https://localhost:3000/dablclub-512x512.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
