# Get Price

Now for the fun part! Let's fetch a live price using the [0x Swap's `/price` endpoints](https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-price) 🙌

In our app, we want to dynamically surface the amount of buy token a user can get whenever they input a sell token amount.

![Modal showing a swap from WMATIC to USDC](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/5285ebcb-36c7-4a0b-ae20-7256d1c79a49)

## Price vs Quote

Before we make a call, let's discuss the difference between _price vs quote_.

The [`/price`](https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-price) endpoint helps us get an _indicative price_.

An indicative price is used when users are just _browsing_ and want to check the price they could receive on a swap. They are not ready for a firm quote yet.

Later, when the user is actually ready to make a swap, we will ping [`/quote`](https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-quote) which returns an order that is ready to submitted on-chain.

`/price` is nearly identical to `/quote`, but with a few key differences:

- `/price` does not return a order that can be submitted on-chain; it simply provides us the same information
- Think of it as the "read-only" version of `/quote"`

It is important to ping `/quote` only when the user is ready to submit the order because Market Makers must commit their assets to settle that swap when they provide the quote. So if we ping `/quote` too much when we really are just asking for a price and not ready to submit an order, then this can clog up the system!

## Fetch price

Fetching a price with the [`/swap/v1/price`](https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-price) endpoint is a straight-forward HTTP GET request. We then need to display the price data accordingly to our users.

### What do we need to do

Now we will surface the amount of buy token a user can swap when they input a sell amount.

We will need to complete the following:

- plug the `/price` endpoint into our PriceView
- automatically fetch a new price whenever the inputs change (e.g. new sell amount, new sell token selected)
- format the user inputted amounts so the API can read it, and format response from the API so it is human-readable

### Get a 0x API key

Every call to a 0x API must include a 0x API secret key. [Create a 0x account](https://dashboard.0x.org/) and get a live API key. See the [guide here](https://0x.org/docs/introduction/getting-started) to get setup.

### Our new modal component: SwapErc20Modal

`SwapErc20Modal` is the component where users can browse for a price without committing to a swap, aka, get the indicative price. Recall that an indicative price is used when users just want to check the price they could receive on a swap, for this we will use the [/swap/v1/price](https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-price) endpoint.

Currently, when a user inputs a `sellAmount`, the corresponding amount they can buy doesn't automatically appear in the UI. We want the `buyAmount` to populate with the price we get from `/swap/v1/price`.

## Fetch price from PriceView

In the previous lesson, we saw how to fetch a price using `/price`. Now we need to plug it into the UI.

### Step 1. Wrap price API request

To do this in Next, we will need to wrap our API request is wrapped behind `/app/api/price/route.ts` using [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

Why wrap? To protect our API keys.

Wrapping our API key protects it because all API requests are viewable by if someone inspects the browser, but we don’t want them inspecting an finding our keys. Instead, when the user queries for an indicative price, it pings our API setup in `/app/api/price/route.ts` and that pings the 0x Swap API using the API key in the header.

```
// Create /app/api/price/route.ts and add this code

import { type  NextRequest } from  "next/server";



export  async  function  GET(request:  NextRequest) {
	const  searchParams  =  request.nextUrl.searchParams;



	try {

		const  res  =  await  fetch(
	`https://polygon.api.0x.org/swap/v1/swap/price?${searchParams}`,
		{
			headers: {
				"0x-api-key":  process.env.NEXT_PUBLIC_ZEROEX_API_KEY  as  string,
		},
	  }
	);
	const  data  =  await  res.json();
	return  Response.json(data);
	} catch (error) {
	console.log(error);
	}
}
```

### Step 2. Automatically fetch price with useEffect hook

Now we need to hook it up to the front-end and trigger a price change anytime the sellAmount updates.

In `SwapErc20Modal`, we use the Next.js App Router's built-in data fetching pattern and the useEffect hook to fetch a price and automatically update the UI will quickly to respond to any changes, such as when the user inputs a new sellAmount.

An overview to our `SwapErc20Modal` component needed updates:

- Install `qs` package via npm i `qs`
- Create a file where we will create our API response types: `types/index.ts`. Copy and paste [this file's content](https://github.com/angelmc32/react-to-web3-bootcamp/blob/main/next-app/types/index.ts), which include both the Price and Quote response interfaces, so we can better handle the integration of the Swap API with our code.
- Import dependencies:
  - `qs` library and `PriceResponse` interface, which we just added to our project
  - useChainId wagmi hook to detect the user's current connected network
  - `formatUnits` and `parseUnits`, a couple of utilities from Viem
- A couple of new state variables to handle the swap direction (needed for the API call) and to handle the Price response
- Functions to handle the selected tokens data, along with parsing of the tokens (we'll explore this in a bit)

For the API call, we ask useEffect to monitor a list of params (sellToken, buyToken, etc), and if ever any of these params change value, then the main() function is executed. In this function, we fetch a new /price with the updated param values.

```
// previous imports...


import { PriceResponse } from '../../../types';
import { useChainId } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import qs from 'qs';

...

export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {

  ...

  const [price, setPrice] = useState<PriceResponse | undefined>();
    const [tradeDirection, setSwapDirection] = useState('sell');

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
  ...

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
    ...
  )
}
```

### Format and Parse `sellAmount` and `buyAmount`

Recall that the inputted `sellAmount` and `buyAmounts` each have their own decimal values. We will need to parse the number that the user inputs to be usable for the API request as well as format the number that is returned by the API request to be easily human readable. To do so, we will use the following methods from `viem`:

- [`parseUnits`](https://viem.sh/docs/utilities/parseUnits) - Parses a string representing ether, such as the string 1.1 into a BigNumber in wei. This is useful to convert a user inputted value into a BigNumber that is usable for API requests.
- [`formatUnits`](https://viem.sh/docs/utilities/formatUnits) - This one does the opposite of parseUnits. It formats a BigNumberish into a string, which is useful when displaying a balance or displaying a BigNumerish value returned from an API response as a string in the UI.

## Summary

Fetch `/swap/v1/swap/price` is wrapped behind `app/api/price/route.ts` and triggered in the UI by `useEffect` in `/app/components/price.tsx`

Your app should now look like this:

![Modal showing token prices obtained from API and properly formatted](https://react-to-web3-bootcamp.vercel.app/content/module-4/L3/1-swap-modal-price.png)
