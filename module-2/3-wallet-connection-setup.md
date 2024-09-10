# Wallet connection

Now we have our project ready to get started. Since we will be interacting with Polygon zkEVM, we need to set up a few libraries that allow us to communicate with the blockchain: connecting wallets, multiple chains, signing messages and data, sending transactions, listening for events and state changes, refreshing stale blockchain data, and much more.

During this bootcamp, we will be using Viem in tandem with Wagmi for blockchain operations, and ConnectKit for wallet management.

- [Viem](https://viem.sh/) is a TypeScript interface for Ethereum that performs blockchain operations.
- [Wagmi](https://wagmi.sh/) is a library built on top of Viem and adds a set of futures that improve the developer experience when interacting with the connected wallet.
- [ConnectKit](https://docs.family.co/connectkit) is a React component library for connecting a wallet to our decentralized application.
- [TanStack Query](https://tanstack.com/query/latest) is an async state manager that handles requests, caching, and more.

Let’s install Wagmi along with TanStack Query, Viem, and ConnectKit:

```
npm install connectkit wagmi viem@2.x @tanstack/react-query
```

ConnectKit uses [WalletConnect](https://walletconnect.com/)'s SDK to help with connecting wallets. WalletConnect 2.0 requires a “projectId” which you can create quickly and easily for free over at [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in). This is not a requirement for the bootcamp, but if you want to enable WalletConnect, you will need to complete this step.

Now we will create a wrapper to provide our application with the methods that the installed libraries offer us: Wagmi, TanStack Query and ConnectKit. We will import the required providers and create a config using wagmi's createConfig method. ConnectKit supplies a pre-configured getDefaultConfig function to simplify the process of creating a config.

`/src/providers/web3Provider.ts`

```
'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { polygonZkEvmCardona } from 'wagmi/chains';

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [polygonZkEvmCardona],
    transports: {
      // RPC URL for each chain
      [polygonZkEvmCardona.id]: http(
`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
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
```

What’s happening here?

- Since we are using NextJS’ app router architecture, where all components are served as React Server Components, we need to use the “use client” directive, as the components from the libraries we are using require APIs and interactivity offered by the client.
- We use Wagmi’s createConfig method combined with ConnectKit’s getDefaultConfig to set the polygonZkEvmCardona chain as our main chain, and we need to connect to an RPC url. We are using Alchemy’s RPC service, which offers a generous free tier, ideal for learning and experimenting.
- We complement with other required variables for ConnectKit. Remember, for walletConnectProjectId for you can obtain one for free here https://cloud.walletconnect.com/sign-in
- ConnectKit’s getDefaultConfig method handles the connectors configuration, making sure that the user has several options available to connect (Injected, WalletConnect, MetaMask, among others)
- We instantiate TanStack’s QueryClient
- We declare and export our wrapper Web3Provider, including all the providers required: WagmiProvider, QueryClientProvider, and ConnectKitProvider, while passing the configuration object and queryClient to their respective providers.

Now that we have created our Web3Provider, we will use it in the `layout.tsx` file, as mentioned before: wrapping all children elements and providing access to the libraries methods and variables.

`/src/providers/web3Provider.ts`

```
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '@/styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Web3Provider } from '@/providers/web3Provider';

export const metadata: Metadata = {
  title: 'React to Web3 Bootcamp',
  description: 'React to Web3 Bootcamp',
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Web3Provider>{children}</Web3Provider>
        <Toaster richColors />
      </body>
    </html>
  );
}
```

And we can test the wallet connection by using the ConnectKitButton component that ConnectKit has. It works out-of-the-box, so we just need to import it and place it inside our main page component to test it.

```
'use client';

import PageWithNavbar from '@/components/layout/page';
import { ConnectKitButton } from 'connectkit';

export default function Home() {
  return (
    <PageWithNavbar>
      <div className="page">
        <div className="container md:pt-4 lg:pt-12 xl:pt-20">
          <h1 className="mb-4 text-6xl">React to Web3 Bootcamp</h1>
          <div className="py-8">
            <ConnectKitButton />
          </div>
        </div>
      </div>
    </PageWithNavbar>
  );
}
```

![Connect wallet button is displayed in homepage](https://react-to-web3-bootcamp.vercel.app/content/module-2/L1/3-connect-wallet.png)

![Connection requested to browser extension wallet](https://react-to-web3-bootcamp.vercel.app/content/module-2/L1/4-request-connection.png)

![Button showing successful connection](https://react-to-web3-bootcamp.vercel.app/content/module-2/L1/5-successful-connection.png)

### Next steps

Perfect, the wallet connection is working. In the next lesson, we will create an Account component where we can display the information of the connected wallet/account and use some of the hooks that Wagmi offers.
