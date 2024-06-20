# Fetch and Display Token List

Currently our app has two dropdowns, one to select a _sellToken_ and one to select a _buyToken_.

![Select field showing available tokens to swap](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/1b3f00c2-ba1c-474c-b437-e0e8e2818718)

Where do these lists of tokens come from?

Thankfully there are several established sources of curated and open-sourced [Token Lists](https://tokenlists.org/) which standardize lists of ERC20 tokens to filter out high quality, legitimate tokens from scams, fakes, and duplicates. Read more about the importance of token lists [here](https://uniswap.org/blog/token-lists).

As developers, we can choose to ingest the entire list or customize our own token lists based off of these sources.

For ERC20 tokens, these lists typically include crucial metadata - such as the token names (Wrapped Matic), symbol (MATIC), address, and logoURI - which can be leveraged by apps such as ours.

Let's learn how to retrieve a list of ERC20 tokens to populate the modal, so that a user can select a token to swap.

## Code

In our demo, we've pre-populated a curated a small token list for you in [`/src/lib/constants.ts`](https://github.com/angelmc32/react-to-web3-bootcamp/blob/main/next-app/src/lib/constants.ts).

> In production level apps, it's common practice to maintain a token list since some apps don't support _all_ available tokens.

> For now, we just have tokens from the Polygon chain, but you could easily add more to enable multi-chain support.

All tokens contain the following metadata:

```
// See /src/constants.ts

name:  string;
address:  Address;
symbol:  string;
decimals:  number;
chainId:  number;
logoURI:  string;
```

The tokens are setup in the array `POLYGON_TOKENS` which are accessible via 2 objects, `POLYGON_TOKENS_BY_SYMBOL` and `POLYGON_TOKENS_BY_ADDRESS`. At different points in the dApp, we may need to access the metadata from different keys.

These token lists are called from the dropdown lists (Select elements) in `/app/components/web3/swapErc20Modal.tsx`.

```
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_SYMBOL,
  Token,
} from '@/lib/constants';

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
};

export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [sellToken, setSellToken] = useState('wmatic');
  const [sellAmount, setSellAmount] = useState('');
  const [buyToken, setBuyToken] = useState('usdc');
  const [buyAmount, setBuyAmount] = useState('');

  const handleSellTokenChange = (value: string) => {
    setSellToken(value);
  };

  function handleBuyTokenChange(value: string) {
    setBuyToken(value);
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

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
}
```

A quick review of the code:

- We are importing the shadcn/ui components and our constants
- We declare the state variables that we will use to handle the tokens identifiers and amounts
- We repeat the hydration pattern with `isMounted` + `useEffect`
- Inside our modal, we place a form with the select elements to display the tokens from the dropdown, alongside an input field to enter the amounts

Note that this is just one way to curate and surface token lists. Other teams may choose to ping an API and dynamically filter the list. The best option is whatever best fits the needs of your project.

## Add a New Token

Let's add DAI to our token list!

Here is the metadata for DAI on Polygon (see details on [PolygonScan](https://polygonscan.com/address/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063)):

```
  {
    chainId: 137,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURI:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
```

Format it correctly inside `/src/lib/constants.ts` so it is accessible by all our objects.

Once you've added DAI to all the objects, you will be able to select it from the dropdown!

![DAI is now available as an option in the select field](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/2f995da3-9e9b-4c12-ba6f-3db86e1243c0)

## Other Notable Token Lists

Want to add more token? Check out these open-sourced Token Lists:

- Tokenlists: [https://tokenlists.org/](https://tokenlists.org/)
- Trust Wallet: [https://github.com/trustwallet/assets/tree/master/blockchains](https://github.com/trustwallet/assets/tree/master/blockchains)
- Polygon Assets github: [https://github.com/maticnetwork/polygon-token-assets/tree/main/assets/tokenAssets](https://github.com/maticnetwork/polygon-token-assets/tree/main/assets/tokenAssets)
- Coin Gecko: [https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json](https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json)

## Recap

In this lesson, we learned about how to source token metadata, curate a token list, and surface this information to users through our UI.

![Final modal showing the available tokens to be swapped](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/a5992263-0839-4ed0-9132-75d7b741aac8)
