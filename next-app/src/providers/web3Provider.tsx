'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig, WagmiProvider } from 'wagmi';
import {
  ConnectKitProvider,
  getDefaultConfig,
  SIWEConfig,
  SIWEProvider,
} from 'connectkit';
import { mainnet, polygon, polygonZkEvmCardona } from 'wagmi/chains';
import { SiweMessage } from 'siwe';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonZkEvmCardona, polygon, mainnet],
    transports: {
      // RPC URL for each chain
      [polygonZkEvmCardona.id]: http(),
      [polygon.id]: http(),
      [mainnet.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',

    // Required App Info
    appName: 'Dabl DevCamp',

    // Optional App Info
    appDescription: 'Become a dApp developer in 2 weeks',
    appUrl: 'https://localhost:3000', // your app's url
    appIcon: 'https://localhost:3000/dablclub-512x512.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

const siweConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/siwe`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce');

    return res.text();
  },
  createMessage: ({
    nonce,
    address,
    chainId,
  }: {
    nonce: string;
    address: string;
    chainId: number;
  }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      uri: window.location.origin,
      domain: window.location.host,
      statement: 'Hey Dabbler, sign-in to our cool app!!!',
    }).prepareMessage();
  },
  verifyMessage: ({
    message,
    signature,
  }: {
    message: string;
    signature: string;
  }) => {
    return fetch(`/api/siwe`, {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.ok);
  },
  getSession: async () => {
    const res = await fetch(`/api/siwe`);
    if (!res.ok) throw new Error('Failed to fetch SIWE session');

    const { address, chainId } = await res.json();
    return address && chainId ? { address, chainId } : null;
  },
  signOut: () => fetch(`/api/siwe`, { method: 'DELETE' }).then((res) => res.ok),
} satisfies SIWEConfig;

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
