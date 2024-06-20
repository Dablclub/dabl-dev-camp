import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  POLYGON_EXCHANGE_PROXY,
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_SYMBOL,
  Token,
} from '@/lib/constants';

import { PriceResponse, QuoteResponse } from '../../../types';
import {
  useBalance,
  useChainId,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address, erc20Abi, formatUnits, parseEther, parseUnits } from 'viem';
import qs from 'qs';
import { toast } from 'sonner';
import { ExternalLinkIcon } from 'lucide-react';

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
};

export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sellToken, setSellToken] = useState('wmatic');
  const [sellAmount, setSellAmount] = useState('');
  const [buyToken, setBuyToken] = useState('usdc');
  const [buyAmount, setBuyAmount] = useState('');
  const [price, setPrice] = useState<PriceResponse | undefined>();
  const [tradeDirection, setSwapDirection] = useState('sell');
  const [quote, setQuote] = useState<QuoteResponse | undefined>();
  const [finalize, setFinalize] = useState(false);

  const handleSellTokenChange = (value: string) => {
    setSellToken(value);
  };

  function handleBuyTokenChange(value: string) {
    setBuyToken(value);
  }

  const chainId = useChainId() || 137;

  const tokensByChain = (chainId: number) => {
    if (chainId === 137) {
      return POLYGON_TOKENS_BY_SYMBOL;
    }
    return POLYGON_TOKENS_BY_SYMBOL;
  };

  const sellTokenObject = tokensByChain(chainId)[sellToken];
  const buyTokenObject = tokensByChain(chainId)[buyToken];

  const sellTokenDecimals = sellTokenObject.decimals;
  const buyTokenDecimals = buyTokenObject.decimals;

  const parsedSellAmount =
    sellAmount && tradeDirection === 'sell'
      ? parseUnits(sellAmount, sellTokenDecimals).toString()
      : undefined;

  const parsedBuyAmount =
    buyAmount && tradeDirection === 'buy'
      ? parseUnits(buyAmount, buyTokenDecimals).toString()
      : undefined;

  const exchangeProxy = (chainId: number): Address => {
    if (chainId === 137) {
      return POLYGON_EXCHANGE_PROXY;
    }
    return POLYGON_EXCHANGE_PROXY;
  };

  // Hook for fetching balance information for specified token for a specific userAddress
  const { data: userTokenBalance } = useBalance({
    address: userAddress,
    token: sellTokenObject.address,
  });

  const insufficientBalance =
    userTokenBalance && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > userTokenBalance.value
      : true;

  async function getQuote(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!userAddress || !price) {
      toast.warning('You must connect your wallet...');
      return;
    }

    const params = {
      sellToken: price.sellTokenAddress,
      buyToken: price.buyTokenAddress,
      sellAmount: price.sellAmount,
      takerAddress: userAddress,
    };
    try {
      const response = await fetch(`/api/quote?${qs.stringify(params)}`);
      const data = await response.json();
      setQuote(data);
      setFinalize(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    const params = {
      sellToken: sellTokenObject.address,
      buyToken: buyTokenObject.address,
      sellAmount: parsedSellAmount,
      buyAmount: parsedBuyAmount,
      takerAddress: userAddress,
    };

    async function main() {
      const response = await fetch(`/api/price?${qs.stringify(params)}`);
      const data = await response.json();

      if (data.buyAmount) {
        setBuyAmount(formatUnits(data.buyAmount, buyTokenObject.decimals));
        setPrice(data);
      }
    }

    if (sellAmount !== '') {
      main();
    }
  }, [
    sellTokenObject.address,
    buyTokenObject.address,
    parsedSellAmount,
    parsedBuyAmount,
    userAddress,
    sellAmount,
    setPrice,
  ]);

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button>Swap ERC20</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Swap ERC20</DialogTitle>
          <DialogDescription>
            The amount entered will be swapped for the amount of tokens
            displayed in the second row
          </DialogDescription>
        </DialogHeader>
        {isMounted ? (
          <div className="w-full">
            <form className="flex flex-col w-full gap-y-8">
              <div className="w-full flex flex-col gap-y-4">
                <div className="w-full flex items-center gap-1.5">
                  <Image
                    alt={buyToken}
                    className="h-9 w-9 mr-2 rounded-md"
                    src={POLYGON_TOKENS_BY_SYMBOL[sellToken].logoURI}
                    width={6}
                    height={6}
                  />
                  <Select
                    onValueChange={handleSellTokenChange}
                    defaultValue="wmatic"
                  >
                    <SelectTrigger className="w-1/4">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {POLYGON_TOKENS.map((token: Token) => {
                        return (
                          <SelectItem
                            key={token.address}
                            value={token.symbol.toLowerCase()}
                          >
                            {token.symbol}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Input
                    className="w-3/4"
                    type="number"
                    name="sell-amount"
                    id="sell-amount"
                    placeholder="Enter amount..."
                    required
                  />
                </div>
                <div className="w-full flex items-center gap-1.5">
                  <Image
                    alt={buyToken}
                    className="h-9 w-9 mr-2 rounded-md"
                    src={POLYGON_TOKENS_BY_SYMBOL[buyToken].logoURI}
                    width={6}
                    height={6}
                  />
                  <Select
                    onValueChange={handleBuyTokenChange}
                    defaultValue="usdc"
                  >
                    <SelectTrigger className="w-1/4">
                      <SelectValue placeholder="Buy..." />
                    </SelectTrigger>
                    <SelectContent>
                      {POLYGON_TOKENS.map((token: Token) => {
                        return (
                          <SelectItem
                            key={token.address}
                            value={token.symbol.toLowerCase()}
                          >
                            {token.symbol}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Input
                    className="w-3/4"
                    type="number"
                    id="buy-amount"
                    name="buy-amount"
                    placeholder="Enter amount..."
                    disabled
                  />
                </div>
              </div>
              <Button>Swap</Button>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );

  function ApproveOrReviewButton({
    userAddress,
    onClick,
    sellAmount,
    sellTokenAddress,
    disabled,
  }: {
    userAddress: Address | undefined;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    sellAmount: string;
    sellTokenAddress: Address;
    disabled?: boolean;
  }) {
    const exchangeProxy = (chainId: number): Address => {
      if (chainId === 137) {
        return POLYGON_EXCHANGE_PROXY;
      }
      return POLYGON_EXCHANGE_PROXY;
    };

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
      address: sellTokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [userAddress ?? '0x0', exchangeProxy(chainId)],
      query: {
        enabled: Boolean(userAddress),
      },
    });

    const {
      data: approvalTxHash,
      isPending: isPendingWriteContract,
      error: errorWriteContract,
      writeContractAsync,
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isTxConfirmed } =
      useWaitForTransactionReceipt({
        hash: approvalTxHash,
      });

    useEffect(() => {
      if (isTxConfirmed) {
        refetchAllowance();
      }
    }, [isTxConfirmed, refetchAllowance, allowance]);

    if (errorWriteContract) {
      return <div>Something went wrong: {errorWriteContract.message}</div>;
    }

    async function onClickHandler(event: React.MouseEvent<HTMLElement>) {
      event.preventDefault();

      try {
        await writeContractAsync({
          abi: erc20Abi,
          address: sellTokenAddress,
          functionName: 'approve',
          args: [exchangeProxy(chainId), parseEther(sellAmount)],
        });
      } catch (error) {
        console.error(error);
      }
    }

    // update button depending if needs approval or approval pending
    if (allowance === 0n || (allowance && allowance < parseEther(sellAmount))) {
      return (
        <>
          <Button onClick={onClickHandler}>
            {isConfirming ? 'Approving…' : 'Approve'}
          </Button>
        </>
      );
    }

    return (
      <Button
        disabled={disabled}
        onClick={async (event) => await onClick(event)}
      >
        {disabled ? 'Insufficient Balance' : 'Review Swap'}
      </Button>
    );
  }

  function ConfirmSwapButton({
    quote,
  }: {
    quote: QuoteResponse | undefined;
    setFinalize: (value: boolean) => void;
  }) {
    const {
      data: swapTxHash,
      isPending,
      sendTransaction,
    } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
        hash: swapTxHash,
      });

    if (!quote) {
      return <div>Getting best quote...</div>;
    }

    return (
      <div className="flex flex-col gap-y-2">
        <Button
          variant="ghost"
          onClick={(event) => {
            event.preventDefault();
            setFinalize(false);
          }}
        >
          Modify swap
        </Button>
        <Button
          disabled={isPending}
          onClick={(event) => {
            event.preventDefault();

            sendTransaction &&
              sendTransaction({
                gas: quote?.gas,
                to: quote?.to,
                value: quote?.value, // only used for native tokens
                data: quote?.data,
                gasPrice: quote?.gasPrice,
              });
          }}
        >
          {isPending ? 'Confirming...' : 'Place Order'}
        </Button>
        {swapTxHash && (
          <div className="pt-4 flex flex-col items-center">
            <Link
              className="hover:text-accent flex items-center gap-x-1.5"
              href={`https://polygonscan.com/tx/${swapTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View tx on explorer <ExternalLinkIcon className="h4 w-4" />
            </Link>
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
          </div>
        )}
      </div>
    );
  }
}
