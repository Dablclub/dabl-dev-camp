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
