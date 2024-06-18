# Intro to Wagmi Hooks

After enabling the wallet connection to our application, now we can access data pertaining the connected wallet. Let’s create an Account component where we can display the information of the connected wallet/account and use some of the hooks that Wagmi offers.

### Our Account component

`/src/components/web3/account.tsx`

```
'use client';

import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { useEffect, useState } from 'react';
import { mainnet } from 'viem/chains';
import Image from 'next/image';

export function Account() {
  const [isMounted, setIsMounted] = useState(false);
  const { address, chain, chainId, isConnected } = useAccount();
  const accountBalance = useBalance({
    address,
  });
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: mainnet.id,
  });

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  if (!isConnected) {
    return (
      <div>
        <p className="text-lg">Not connected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-y-4">
      {ensAvatar && ensName && isMounted && (
        <div className="flex items-center gap-x-2">
          <Image
            alt="ENS Avatar"
            src={ensAvatar}
            className="h-16 w-16 rounded-full"
            height={64}
            width={64}
          />
          {ensName && <p className="text-2xl">{ensName}</p>}
        </div>
      )}
      {address && isMounted && (
        <>
          <p className="text-lg">{address}</p>
        </>
      )}
      <div className="flex flex-col gap-y-2">
        {accountBalance && (
          <p className="text-xl">
            Balance: {accountBalance.data?.formatted} ETH
          </p>
        )}
        {chain && chainId && isMounted && (
          <p className="text-lg">
            {chain.name}, chainId: {chainId}
          </p>
        )}
      </div>
    </div>
  );
}
```

What’s happening here?

- We import and use some of Wagmi’s hooks:
  - `useAccount` for getting current account (address) and connection status
  - `useBalance` for fetching native currency or token balance
  - `useEnsAvatar` for fetching ENS avatar for name
  - `useEnsName` for fetching primary ENS name for address
- We use useEffect and useState to avoid hydration errors, by making sure that the component is mounted when using the ENS-related hooks
- We use conditional rendering, once the hooks fetch the information from the blockchain, we render it inside our component

Yes, you read that right. After setting up our providers, we can access directly to blockchain information using just a couple of hooks. Even get ENS name and avatar’s obtained directly from a connected wallet’s address.

### Using our new component

Looks simple, right? Let’s use our freshly created component in our app by importing it in the root page:

`/src/app/page.tsx`

```
'use client';

import PageWithNavbar from '@/components/layout/page';
import { Account } from '@/components/web3/account';
import { ConnectKitButton } from 'connectkit';

export default function Home() {
  return (
    <PageWithNavbar>
      <div className="page">
        <div className="container md:pt-4 lg:pt-12 xl:pt-20">
          <h1 className="mb-4 text-6xl">React to Web3 Bootcamp</h1>
          <div className="py-8 w-full flex flex-col items-center gap-y-4">
            <ConnectKitButton />
            <Account />
          </div>
        </div>
      </div>
    </PageWithNavbar>
  );
}
```

As we can see, we are displaying the user’s address and the current balance for this address. We are also displaying the current chain to which we are connected, and of course, the user’s address. If the connected address has an ENS,

Make sure to change NextJS’ configuration file to fully support WalletConnect and the images served by IPFS to support users’ avatars when they have ENS.

`next.config.mjs`

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
    ],
  },
};

export default nextConfig;
```

![Component showing connected wallet's ENS and ENS avatar, balance and current connected network](https://react-to-web3-bootcamp.vercel.app/content/module-2/L2/1-account-data.png)

### Next steps

Excellent, we are connected to Polygon zkEVM Cardona, and we can display information regarding our users ENS (check the avatar!), the chain's information and the native currency's balance, with just a couple of hooks.

Next lesson, we will get some testnet tokens and send our first transaction.
