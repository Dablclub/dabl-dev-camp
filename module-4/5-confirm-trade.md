# Confirm Swap

In this lesson, we will setup the ConfirmSwapButton where users can get a firm quote and finally place their order!

![](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/dd535749-cdba-4cd2-a843-436e643d6f15)

## What is it?

After the user has made their token selection, entered the `sellAmount`, and approved the token allowance, we will show them the ConfirmSwapButton component.

Along the `ConfirmSwapButton`, on our parent component, `SwapErc20Modal`, we will provide our users with an overview of the transaction details before executing the token swap. Earlier, we provided users an indicative price because they were just browsing for pricing information, so did not need a full 0x order. Now, users are ready to fill the order, so we need to provide them a firm quote, and the Market Makers can know to reserve the proper assets to settle the swap.

## UI/UX Walk-through

The UI for the `SwapErc20Modal` should be as follows:

- Displays the **sell** and **buy Amounts** that the user pays and receives, respectively
  - The UI displays the sell and buyAmounts returned by the `/quote` endpoint. These are formatted based off of the decimal values from the token list. It also shows the token images retrieved from our token list.
- From here, the user can **“Place Order”** which creates, signs, and sends a new transaction to the network.
- The modal should handle the logic to render either the `ApproveOrReviewButton` or the `ConfirmSwapButton`

## Code

Let's code it up! At a high-level, this is what we will need to code:

- Create a `ConfirmSwapButton` component
- Fetch a firm quote
- Send the transaction (using the steps from [wagmi's Send Transaction guide](https://wagmi.sh/react/guides/send-transaction))

### 1. Create a new component and wire it up

Create a new `ConfirmSwapButton` component that will receive the quote data, obtained when the user clicks the "Review Swap" button, indicating they are ready to confirm and send the transaction.

We need a couple of additional imports too.

```
// previous imports
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {
  // previous logic
  ...

  function ApproveOrReviewButton({
    ...
  }) {
    ...
    return(
      ...
    )
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
```

Next, we need to wire up this new `quote` component and add logic for when it will appear in the UI. This will be set up in the `SwapErc20Modal` component. It is displayed if the user has approved the token allowance, and clicked "Review Swap" to finalize the swap selection.

```
// Add QuoteView logic in /app/page.tsx
export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {
    // previous logic
    ...
    return(
      ...
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
              value={
                finalize && quote
                  ? formatUnits(
                      BigInt(quote.sellAmount),
                      sellTokenDecimals
                    )
                  : sellAmount
              }
              placeholder="Enter amount..."
              required
              onChange={(event) => {
                setSwapDirection('sell');
                setSellAmount(event.target.value);
              }}
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
              value={
                finalize && quote
                  ? formatUnits(BigInt(quote.buyAmount), buyTokenDecimals)
                  : buyAmount
              }
              placeholder="Enter amount..."
              disabled
              onChange={(event) => {
                setSwapDirection('buy');
                setSellAmount(event.target.value);
              }}
            />
          </div>
        </div>
        {finalize && price ? (
          <ConfirmSwapButton quote={quote} setFinalize={setFinalize} />
        ) : (
          <ApproveOrReviewButton
            sellAmount={sellAmount}
            sellTokenAddress={POLYGON_TOKENS_BY_SYMBOL[sellToken].address}
            userAddress={userAddress}
            onClick={getQuote}
            disabled={insufficientBalance}
          />
        )}
      </form>
    )

  function ApproveOrReviewButton({
    ...
  }) {
    ...
    return(
      ...
    )
  }

  function ConfirmSwapButton({
    ...
  }) {
    ...
    return(
      ...
    )
  }
```

### 2. Fetch a firm quote

Fetch a firm quote using the [`useEffect`](https://react.dev/reference/react/useEffect) hook. We created this function in the previous lesson, time to use it in our component by passing it the quote state variable

```
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
```

Next, setup the [route handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) for the `/quote` API endpoint

```
// Setup /app/api/quote/route.ts
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const res = await fetch(
    `https://polygon.api.0x.org/swap/v1/quote?${searchParams}`,
    {
      headers: {
        "0x-api-key": process.env.NEXT_PUBLIC_ZEROEX_API_KEY as string,
      },
    }
  );
  const data = await res.json();

  return Response.json(data);
}
```

### 3. Hook up the `useSendTransaction` hook

To submit our transaction, we will hook up the [`useSendTransaction` hook](https://wagmi.sh/react/api/hooks/useSendTransaction)

```
// In /app/components/quote.tsx
...
  const {
      data: swapTxHash,
      isPending,
      sendTransaction,
    } = useSendTransaction();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
        hash: swapTxHash,
      });
...
```

When the user clicks the "Place Order" button, we can use wagmi's [`sendTransaction`](https://wagmi.sh/core/api/actions/sendTransaction#sendtransaction) create, sign, and send the transaction. We will need to pull out the required params (gas, to, value, data, gasPrice) from our API quote response and pass them to `sendTransaction`. This will trigger an action for the user to sign the transaction from their wallet. If the user has enough gas and has signed the transaction, the order is submitted to the network.

```
  ...
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
  ...
```

### 4. Wait for transaction receipt

A submitted transaction usually takes some time to be confirmed on-chain. Thus, we should dispaly the transaction confirmation status to the user by using the [`useWaitForTransactionReceipt` hook](https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt).

## 5. View submitted order on block explorer

`sendTransaction` will return the transaction hash which we can use to redirect users to view the the successfully submitted transaction on the corresponding blockchain explorer.

Here is an example swap that was made through 0x Exchange Proxy (0.1 WMATIC -> 0.67677 USDC). You can [view this transaction on Polygonscan](https://polygonscan.com/tx/0xf485546ee2a3e556faf7a8a859f96444294c548181aeff78e255a3e0326ba493)!

![](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/026cff37-dcde-403f-9db8-848213d0f530)

## Recap

We now have a completed token swapping dApp from which you can get live pricing and make real swaps that settle on the blockchain!
