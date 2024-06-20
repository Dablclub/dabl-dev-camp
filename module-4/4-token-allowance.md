# Set Token Allowance and Check Sufficient Balance

We are now able to fetch a live price, even if the user's wallet is not connected!

Now before we can allow users to ping `/quote` and perform the swap, we will need the user to connect their wallet and approve a token allowance.

A token allowance is required if you want a third-party to move funds on your behalf. In short, you are _allowing_ them to move your tokens.

In our case, we would like the [0x Exchange Proxy smart contract](https://docs.0x.org/introduction/0x-cheat-sheet#exchange-proxy-addresses) to swap our ERC20 tokens for us, so we will need to _approve_ an _allowance_ (a certain amount) for _this contract to move a certain amount of our ERC20 tokens on our behalf_. Read more about [token allowances](https://0x.org/docs/0x-swap-api/advanced-topics/how-to-set-your-token-allowances).

This allowance approval will show up in the user's wallet for them to sign. Here is an example screenshot from MetaMask:

![Browser extension wallet asked for approval transaction confirmation](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/9743b971-a8bc-4269-8b11-77ee2c64b609)

Note that approving an allowance is a transaction, which requires users to pay gas (e.g. user must hold the chain's native token, ETH on mainnet, MATIC on Polygon).

Need to quickly revoke an allowance while testing? To revoke an allowance, you can set the allowance to 0. This can be done programmatically or through a UI such as https://revoke.cash/ .

## Here is the UI we need to setup:

- User selects **sell** and **buy tokens** from the token selectors
- Users inputs a **sellAmount**
- Whenever sellAmount changes, the **app fetches a price** even if a wallet is not connect
- Displays returned **buyAmount**
- When users find a price they like, the button now says **Approve** if the user has enough of the sell token
  - The Approval button allows users to set a token allowance
  - This is standard practice when users need to give a token allowance for a third-party to move funds on our behalf, in this case 0x Protocol’s smart contract, specifically the 0x Exchange Proxy to swap the user’s ERC20 tokens on their behalf.
  - Users can set an amount they are comfortable with, the default we’ve set is the `sellAmount`
- When the user is happy with this swap, the button is now **“Review Swap** because the user already approved the token allowance, so they can move forward to review the firm quote

To summarize,

![](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/05346bc2-8bae-4219-aa7b-18f6195cf246)

_The connected wallet has not approved a token allowance for DAI -> button reads "Approve"_

![](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/adae9e12-5b93-45c5-965f-1048ec4c466d)

_The connected wallet has already approved a token allowance for WMATIC & has enough balance to proceed -> button reads "Review Swap"_

![](https://github.com/jlin27/token-swap-dapp-course/assets/8042156/9f601765-5acd-4773-8f5d-caa3337ce6f3)

_The connected wallet has already approved a token allowance for WMATIC, but does not have enough balance to proceed -> button reads "Insufficent Balance"_

## Code

We add the useBalance hook as import to get the user's token balance, and we can compare it against the amount they want to sell, and store it in the `insufficientBalance` as a boolean. We will be passing this value as a prop to a new component that we will create to handle approval and getting a real-time quote: `ApproveOrReviewButton`

1. First, set up the function our component by adding required imports, state variables to hold Swap API quote, and a boolean to flag when a user has confirmed the quote.

2. Create a `getQuote` function that will handle the Swap API request and response, and will help to indicate when the quote price is ready to be confirmed by the user.

```
// previous imports...
// add required hooks from wagmi
import {
  useBalance,
  useChainId,
  useReadContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
// add POLYGON_EXCHANGE_PROXY import
import {
  POLYGON_EXCHANGE_PROXY,
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_SYMBOL,
  Token,
} from '@/lib/constants';
// add QuoteResponse interface import
import { PriceResponse, QuoteResponse } from '../../../types';
// toast for better ux
import { toast } from 'sonner';
// update viem imports to include generic ERC20 ABI and parseEther method
import {
  Address,
  erc20Abi,
  formatUnits,
  parseEther,
  parseUnits
} from 'viem';

...

export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {
  ...
  // other state variables
  const [quote, setQuote] = useState<QuoteResponse | undefined>();
  const [finalize, setFinalize] = useState(false);

  ...

  // Hook for fetching balance information for specified token for a specific userAddress
  const { data: userTokenBalance } = useBalance({
    address: userAddress,
    token: sellTokenObject.address,
  });

  // Check if user can cover the desired sellAmount comparing it to the user's token balance
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

  ...

  return (
    ...
  )
}
```

3. We will need to create a custom button called `ApproveOrReviewButton` to allow users to approve the token allowance, if it hasn't been approved already.

```
  function ApproveOrReviewButton({
    userAddress,
    onClick, // function to call when clicked
    sellAmount, // token amount the user wants to sell
    sellTokenAddress, // token smart contract address
    disabled, // boolean to handle button states
  }: {
    userAddress: Address | undefined;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    sellAmount: string;
    sellTokenAddress: Address;
    disabled?: boolean;
  }) {
    ...

    return(
      ...
    )
  }
```

The logic to check if the user has approved a token allowance the selected sell token is as follows:

- We need to check if the spender (0x Exchange Proxy) has an allowance already. We can use wagmi's [useReadContract](https://wagmi.sh/react/api/hooks/useReadContract) hook to read from the sellToken's "allowance" function.

```
const { data: allowance, refetch: refetchAllowance } = useReadContract({
      address: sellTokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [userAddress ?? '0x0', exchangeProxy(chainId)],
      query: {
        enabled: Boolean(userAddress),
      },
    });
```

Let's explain the `useReadContract` hook's configuration:

- address: we are targeting an ERC20 smart contract - the token the user wants to sell
- abi: we import this "utility" from viem, `erc20Abi`, to access allowance function (and any function compliant with the ERC-20 Token Standard)
- functionName: this is where we define which function we want to call, in this case, allowance
- args: according to the ERC-20 Token Standard, we need to send the token owner's address, along with the address to which the owner wants to set an allowance to spend on their behalf.
- query: remember, Wagmi uses TanStack Query as a dependency. Here you can access some of the query configuration provided by TanStack. We are indicating that the query should be enabled only when a userAddress is detected.

This is how you can use this hook for any smart contract, as long as you have the ABI, you can at least know how to communicate with the smart contract. Beware, because the code can still be malicious. The ERC-20 Token Standard only covers basic functionality implementation, but anyone can place malicious code inside this functions. Always check if the smart contract is verified and review the code in the block explorer.

**Reminder: don't trust, verify**

4. If there is no allowance, then we will write an approval to the sellToken's smart contract using wagmi's [useWriteContract](https://wagmi.sh/react/api/hooks/useWriteContract#usewritecontract) hook. For this example, we will set the allowance to a the sellToken amount (just the amount needed) to prevent putting the wallet at too much risk.

The definition for the hook call is inside the `onClickHandler` function.

```
function ApproveOrReviewButton({
    ...
}) {
    const {
      data: approvalTxHash,
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
```

Let's explain the `useWriteContract` hook's configuration:

- address: similar to the previous hook - the token the user wants to approve
- abi: same as previous hook, to access allowance function (and any function compliant with the ERC-20 Token Standard)
- functionName: this is where we define which function we want to call, in this case, approve
- args: according to the ERC-20 Token Standard, we need to send the spender's address, along with the amount of tokens that address is allowed to spend on thei user's behalf.

The button component we return will depend on the current status of the user's allowance and their current balance - we will the update custom button with the proper message:

- Show "Approve" and connect approval function call to that button
- Show "Insufficient Balance" if the connected wallet does not have enough funds to make the swap
- Show "Review Swap" if the approval went through and the user can proceed to swap.
  We still have to build the swap feature.

> Be aware that approvals do cost gas! _Looking for a gasless approach? Check out [Gasless API](https://0x.org/docs/tx-relay-api/introduction)._

> Need to quickly revoke an allowance while testing? To revoke an allowance, you can set the allowance to 0. This can be done programmatically or through a UI such as [https://revoke.cash/](https://revoke.cash/).

## Recap

In this lesson, we covered:

- what is a token allowance
- how to approve a token allowance, specifically for the [0x Exchange Proxy smart contract](https://docs.0x.org/introduction/0x-cheat-sheet#exchange-proxy-addresses)
- how to revoke an approved token allowance through a UI such as [https://revoke.cash/](https://revoke.cash/).
- how to modify the dApp UI to adjust to whether or not a token allowance approval is needed
- check if the user has sufficient balance to proceed to place the swap
