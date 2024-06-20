# Changing the Ethereum State - Writing into a Contract

Previously, we were able to read from the "Ethereum state" to get the BOOTCAMP token balance for the connected address. We just had to configure a Wagmi hook and we were getting the data directly from the smart contract.

But DeFi users don't want to just read that they have 0 balance for your token (or any token, for that matter). Users want to be able to mint and swap assets. However, this needs to change the state of the Ethereum Virtual Machine, and for that we need a new hook from Wagmi: useWriteContract.

### Which functions are we using?

Last lesson, we used the ABI for our custom ERC-20 token smart contract, BOOTCAMP.

Remember, iff you’ve cloned the repository, you can find the ABI in `src/lib/contracts/BootcampTokenABI.ts`.

You can also copy and paste it from [our Github repository](https://github.com/angelmc32/react-to-web3-bootcamp/blob/main/next-app/src/lib/contracts/BootcampTokenABI.ts)

Reviewing last lesson's code for the smart contract, and knowing that it's compliant with the ERC-20 token standard, we could try to mint some tokens by calling the mint function, which is part of the ERC-20 standard. However, if you know a little bit about Solidity, you could see in our contract that only the smart contract’s owner can call the mint function.

If you were able to detect that, you can also see that we included a claim function, which anyone can call. If the sender hasn’t called that function before, it will mint a set amount of tokens. Looks like we can connect this function to get some tokens, that we could later transfer.

So, we will use the `claim` function first, followed by the `transfer` function, once we get some tokens that we can transfer.

### Custom mint function - Claim ERC20 transaction

Let’s create a button inside our sendErc20Modal that will only be shown when the user has 0 balance. See, we will be using the balance right away.

We will be using the useWriteContract hook, which allows you to mutate data on a smart contract (write), from a payable or nonpayable function. These types of functions require gas to be executed, hence a transaction is broadcasted in order to change the state.

In our code, we will call the useWriteContract to get the required method and variables, along with the useWaitForTransactionReceipt hook which we used before. We will create a custom handleClaimTokens function where we will call the writeContractAsync method, passing to it the required parameters that identify the smart contract and the function we will call, along with some UX helpers.

Then, in our return statement, we will include a conditional render where, if the user has 0 balance for the Bootcamp Token, the claim button will show, allowing the users to claim their first tokens. What would happen if the users transfer the claimed tokens, so they have 0 balance again? Submit your answer to get extra points!

```
// ...all your previous imports

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
};

export default function SendErc20Modal({ userAddress }: SendErc20ModalProps) {
...

const [isPendingClaim, setIsPendingClaim] = useState(false);

	...

const { data: hash, isPending, writeContractAsync } = useWriteContract();

const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

async function handleClaimTokens(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    if (!userAddress) {
      toast.warning('You must connect your wallet...');
      return;
    }
    setIsPendingClaim(true);
    try {
      const hash = await writeContractAsync({
        abi: BootcampTokenABI,
        address: erc20ContractAddress as `0x${string}`,
        functionName: 'claim',
        args: [userAddress],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPendingClaim(false);
    }
  }


	return(
		...
		 {isMounted ? (
          	<div className="w-full">
            <div className="text-center flex flex-col">
              {isSuccess ? (
                <>
                  <h2>{parseFloat(formatEther(erc20Balance)).toFixed(2)}</h2>
                  <h4>BOOTCAMP</h4>
                  {parseFloat(formatEther(erc20Balance)) === 0 && (
                    <div className="w-full py-2">
                      <Button
                        onClick={handleClaimTokens}
                        variant="secondary"
                        disabled={isPending}
                      >
                        {isPendingClaim ? 'Claiming...' : 'Claim'}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <form
              className="flex flex-col w-full gap-y-2"
              onSubmit={submitTransferErc20}
            >

...

	)
}
```

After connecting the hook to our custom function, and including it in the React component, the Claim button should show. We can click it, and your wallet should prompt you to sign the claimToken transaction. We need to pay gas for this, so if you don’t have ETH on Polygon zkEVM Cardona, you can head to the faucet:

https://faucet.polygon.technology/

Once you get some test ETH for Polygon zkEVM Cardona testnet, we can click on the Claim button and get 25 BOOTCAMP tokens:

![Modal showing Claim button when user has 0 balance](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/1-claim-button.png)

![Confirming claim transaction on browser extension wallet](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/2-sign-claim-tx.png)

![Modal showing new balance (25) after claiming transaction is confirmed](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/3-claim-success.png)

### Transfer ERC20 transaction

The UI should update while the transaction is processed, and the transaction hash and link will appear in the UI. You can check the transaction which was just processed in a live testnet. And you got some BOOTCAMP tokens now, congratulations!

Now, let’s see if we can send some of these tokens to any address that we choose. Once again, we will use the useWriteContract hook, but we will use a different function: transfer.

```
...

export default function SendErc20Modal({ userAddress }: SendErc20ModalProps) {
...

const [isPendingSend, setIsPendingSend] = useState(false);

	...

  async function submitTransferErc20(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userAddress) {
      toast.warning('You must connect your wallet...');
      return;
    }
    setIsPendingSend(true);
    try {
      await writeContractAsync({
        abi: BootcampTokenABI,
        address: erc20ContractAddress as `0x${string}`,
        functionName: 'transfer',
        args: [toAddress as `0x${string}`, parseEther(tokenAmount)],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPendingSend(false);
    }
  }
	...
	return(
		...
	)
}
```

Now, we can enter another address to which we want to transfer some BOOTCAMP tokens, and enter the amount to transfer.

![Requesting signature to sumbit Transfer transaction for 1 BOOTCAMP to specified address](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/4-confirm-transfer.png)

![Awaiting transfer transaction confirmation](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/5-await-confirmation.png)

![Modal showing token balance reduced after successful transfer](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/6-transfer-success.png)

Remember, you can always click on the tx link to the explorer to review the transaction status yourself:

![Block explorer showing the transaction success](https://react-to-web3-bootcamp.vercel.app/content/module-3/L5/7-block-explorer.png)

### Next steps

Amazing! We were able to connect to a custom ERC20 token, get some tokens by interacting with it and transfer tokens to another account: the basics of DeFi.

For the next module, we will work with an established DeFi protocol to allow token swaps. We will explore ERC-20 approvals, and how to handle this flows for a better user experience.
