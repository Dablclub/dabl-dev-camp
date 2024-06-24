'use client';

import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { useEffect, useState } from 'react';
import { mainnet } from 'viem/chains';
import Image from 'next/image';
import SendEthModal from './sendEthModal';
import SendErc20Modal from './sendErc20Modal';
import SwapErc20Modal from './swapErc20Modal';

export function Account() {
  const [isMounted, setIsMounted] = useState(false);
  const { address: userAddress, chain, chainId, isConnected } = useAccount();
  const accountBalance = useBalance({
    address: userAddress,
  });
  const { data: ensName } = useEnsName({
    address: userAddress,
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

  if (!isMounted) {
    return (
      <div>
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div>
        <p className="text-lg">Not connected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center gap-y-4">
      {ensAvatar && ensName && (
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
      {userAddress && (
        <>
          <p className="text-lg">{userAddress}</p>
        </>
      )}
      <div className="flex flex-col gap-y-2">
        {accountBalance && (
          <p className="text-xl">
            Balance: {accountBalance.data?.formatted} ETH
          </p>
        )}
        {chain && chainId && (
          <p className="text-lg">
            {chain.name}, chainId: {chainId}
          </p>
        )}
      </div>
      <div className="flex justify-center gap-x-8">
        <div className="w-2/5">
          <SendEthModal />
        </div>
        <div className="w-2/5">
          <SendErc20Modal userAddress={userAddress} />
        </div>
        <div className="w-2/5">
          <SwapErc20Modal userAddress={userAddress} />
        </div>
      </div>
    </div>
  );
}
