# Reading from a custom ERC-20 Smart Contract

To demonstrate how we can interact with smart contracts using ABIs, we’ll use our custom ERC-20 token contract, BootcampToken.

Below is the Solidity code for BootcampToken, which inherits from OpenZeppelin’s ERC-20 and Ownable contracts and includes additional functionality for minting tokens and allowing users to claim rewards.

```
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract BootcampToken is ERC20, Ownable, ERC20Permit {
	uint256 public _dablBootcampReward;
	mapping(address => bool) public hasAddressClaimed;

	constructor(
		uint256 bootcampReward_,
		address owner_
	)
		ERC20("Dabl Club Bootcamp Token", "BOOTCAMP")
		Ownable()
		ERC20Permit("Dabl Club Bootcamp Token")
	{
		_dablBootcampReward = bootcampReward_;
		_transferOwnership(owner_);
	}

	function mint(address to_, uint256 amount_) public onlyOwner {
		_mint(to_, amount_);
	}

	function claim(address to_) public {
		require(hasAddressClaimed[to_] == false, "Address has claimed reward");
		hasAddressClaimed[to_] = true;
		_mint(to_, _dablBootcampReward);
	}
}
```

This contract defines a few key functions: mint, which allows the owner to mint new tokens; and claim, which lets users claim a specified reward if they haven’t done so already.

To enable our frontend to interact with this smart contract, we need to reference its ABI. The ABI will allow us to call these functions and read data from the contract directly from our React application. Specifically, we will create a modal component that:

1. Loads the user's ERC-20 token balance using the balanceOf function.
2. Allows users to transfer tokens by entering a recipient’s address and the amount to be sent, utilizing the transfer function.
3. Ensures proper formatting of token amounts using the parseEther utility from Viem.
4. (Optionally) Uses the approve function to handle scenarios where another address needs to spend tokens on behalf of the user.

With our BootcampToken contract and its ABI, we can now move forward with implementing these interactions in our frontend. This transition sets the stage for integrating smart contract functionality seamlessly into our DeFi application, empowering users to manage their tokens efficiently and securely.

Here’s the starting point for the SendErc20Modal component, very similar to the SendEthModal component. We have created the functionality to read the contract’s balance for the connected user. Let’s go through the code:

```
import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import BootcampTokenABI from '@/lib/contracts/BootcampTokenABI';

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
};

export default function SendErc20Modal({ userAddress }: SendErc20ModalProps) {
  const [toAddress, setToAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const erc20ContractAddress =
    process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ??
    '0xd66cd7D7698706F8437427A3cAb537aBc12c8C88';

  const { data: erc20Balance, isSuccess } = useReadContract({
    abi: BootcampTokenABI,
    address: erc20ContractAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [userAddress ?? '0x0'],
    query: {
      enabled: Boolean(userAddress),
    },
  });

  function submitTransferErc20() {
    return 'placeholder function...';
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button>Send ERC20</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Send ERC20</DialogTitle>
          <DialogDescription>
            The amount entered will be sent to the address once you hit the Send
            button
          </DialogDescription>
        </DialogHeader>
        {isMounted ? (
          <div className="w-full">
            <div className="text-center flex flex-col">
              {isSuccess ? (
                <>
                  <h2>{parseFloat(formatEther(erc20Balance)).toFixed(2)}</h2>
                  <h4>BOOTCAMP</h4>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <form
              className="flex flex-col w-full gap-y-2"
              onSubmit={submitTransferErc20}
            >
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  name="address"
                  placeholder="0xA0Cf…251e"
                  required
                  onChange={(event) => setToAddress(event.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="value">Amount</Label>
                <Input
                  name="value"
                  placeholder="0.05"
                  required
                  onChange={(event) => setTokenAmount(event.target.value)}
                />
              </div>
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

As you can see, one of our imports is the BootcampTokenABI. If you’ve cloned the repository, you can find the ABI in src/lib/contracts/BootcampTokenABI.ts

You can also copy and paste it from [our Github repository](https://github.com/angelmc32/react-to-web3-bootcamp/blob/main/next-app/src/lib/contracts/BootcampTokenABI.ts)

Also, make sure to create a .env.local file and place this variable in it:

```
NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS="0xd66cd7D7698706F8437427A3cAb537aBc12c8C88"
```

Now, we will use Wagmi’s useReadContract hook: allows you to read data on a smart contract, from a view or pure (read-only) function. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.

```
// ...all your previous imports

import BootcampTokenABI from '@/lib/contracts/BootcampTokenABI';

export default function SendErc20Modal() {
	...

  const erc20ContractAddress =
    process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ??
    '0xd66cd7D7698706F8437427A3cAb537aBc12c8C88';

  const { data: erc20Balance, isSuccess } = useReadContract({
    abi: BootcampTokenABI,
    address: erc20ContractAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [userAddress ?? '0x0'],
    query: {
      enabled: Boolean(userAddress),
    },
  });

	return(
		...
	)
}
```

What is happening?

- We use the BootcampTokenABI that we stored in the `src/lib/contracts/BootcampTokenABI.ts` file (which we need to import).
- Then we set the contract address provided from the environment variable. We “hardcode” it to make it available, in case you forget about the env variable.

This is intentional, to illustrate the flexibility of this hook. You can interact with any smart contract, as long as you have the contract’s address for the chain where it was deployed. In our case, we could interact with any ERC-20 smart contract on Polygon zkEVM Cardona, even if it wasn’t deployed by us. It will have at least the same base functionality, thanks to the standard.

Now we can use the data from the hook, which whe have named erc20Balance. Also, we will do a conditional render using the isSuccess property from the hook call. This way, we will only try to access the erc20Balance variable if the communication with the blockchain is successful (via the useReadContract hook).

```
...

export default function SendErc20Modal() {
	...

	return(
		...
		{isMounted ? (
          	  <div className="w-full">

             <div className="text-center flex flex-col">
               {isSuccess ? (
                 <>             <h2>{parseFloat(formatEther(erc20Balance)).toFixed(2)}</h2>
                  <h4>BOOTCAMP</h4>
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

Now we import our new component into the Account component, and place it inside the div that contains the SendEthModal component

```
// ...all your previous imports

import SendErc20Modal from './sendErc20Modal';


import BootcampTokenABI from '@/lib/contracts/BootcampTokenABI';

export function Account() {
	...

	return(
		...
		 <div className="flex justify-center gap-x-8">
        <div className="w-2/5">
          <SendEthModal />
        </div>
        <div className="w-2/5">
          <SendErc20Modal userAddress={userAddress} />
        </div>
      </div>
...

	)
}
```

Here's how our component looks:

![Send ERC-20 button](https://react-to-web3-bootcamp.vercel.app/content/module-3/L4/1-send-erc20-button.png)

![Modal showing user's balance for our custom ERC-20 token](https://react-to-web3-bootcamp.vercel.app/content/module-3/L4/2-send-erc20-modal.png)

### Next steps

Great, we are getting back the current balance for the Dabl Club Bootcamp Token, $BOOTCAMP. As you can see, we currently hold no tokens (balance = 0.0), which is expected.

In the next lesson, we will connect our frontend with 2 functions from our Smart Contract: first, to get some tokens, and the second, to transfer some of these tokens to anyone we want.
