'use client';

import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { useEffect, useState } from 'react';
import { mainnet } from 'viem/chains';
import Image from 'next/image';

export function Account() {
  const [isMounted, setIsMounted] = useState(false);
  const { address, chain, chainId } = useAccount();
  const accountBalance = useBalance({
    address,
  });
  const { data: ensName } = useEnsName({
    address: '0xF54f4815f62ccC360963329789d62d3497A121Ae',
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
