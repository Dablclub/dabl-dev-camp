# Sending Native Currency

Excellent, we are connected to Polygon zkEVM Cardona and we tested some hooks from wagmi.

### Getting testnet tokens

Now let’s get some Polygon zkEVM Cardona testnet ETH. You can get some using our official faucet, you only have to join our Discord server!

https://faucet.polygon.technology/

### Creating component

Now, let’s create a transaction. Wagmi has the perfect hook that will allow us to quickly set up a form that accepts an address and an amount value. We can pass these variables to the hook, and it will prompt our users for confirmation upon hitting the submit button of the form.

We will create a modal component using shadcn/ui’s Dialog, alongside other components:

`/src/components/web3/sendEthModal.tsx`

```
import { useEffect, useState } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
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
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';

export default function SendEthModal() {
  const [toAddress, setToAddress] = useState('');
  const [ethValue, setEthValue] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function submitSendTx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendTransaction({
      to: toAddress as `0x${string}`,
      value: parseEther(ethValue),
    });
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Send ETH</DialogTitle>
          <DialogDescription>
            The amount entered will be sent to the address once you hit the Send button
          </DialogDescription>
        </DialogHeader>
        {isMounted ? (
          <div className="w-full">
            <form
              className="flex flex-col w-full gap-y-2"
              onSubmit={submitSendTx}
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
                  onChange={(event) => setEthValue(event.target.value)}
                />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Confirming...' : 'Send'}
              </Button>
            </form>
            {hash && (
              <div className="pt-8 flex flex-col items-center">
                <Link
                  className="hover:text-accent flex items-center gap-x-1.5"
href={`https://cardona-zkevm.polygonscan.com/tx/${hash}`}
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
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

Let’s quickly review the component:

- We declare some state variables to hold the address and eth amount to be sent, as well as a isMounted variable to make sure that our component is ready to be used.
- We use the useSendTransaction hook to get access to the sendTransaction method, which does exactly what it means. We rename the data variable to hash, as once the sendTransaction method is executed, the transaction will be submitted to the blockchain and gets assigned a hash. This hash is stored in the data variable for this hook. We also use the isPending variable for better UX.
- The useWaitForTransactionReceipt will be used for UX as well, to inform the user of the transaction status in the UI.
- In our submitSendTx function we use the sendTransaction method obtained from the hook, passing to it the address and eth amount state variables that we declared. We are also using a utility from Viem, parseEther, to format the eth value in the correct units that the EVM expects. We will discuss this further in the next module.
- We are rendering a button that opens a modal with the form for sending ETH, and we conditionally render the transaction data once we have it available, such as a link to the block explorer tracking the transaction, and a status message.

Bonus: Ideally, we should do some input validation to make sure that only valid addresses are accepted, and that the eth amount entered is not greater than the current balance.

Here’s how our component looks:

![Send button displayed in app](https://react-to-web3-bootcamp.vercel.app/content/module-2/L5/1-send-button.png)

![Send native currency modal open with 2 input fields: address and amount](https://react-to-web3-bootcamp.vercel.app/content/module-2/L5/2-show-modal.png)

![Browser extension wallet requests confirmation signature](https://react-to-web3-bootcamp.vercel.app/content/module-2/L5/3-request-signature.png)

![Modal shows transaction linked and confirmation message](https://react-to-web3-bootcamp.vercel.app/content/module-2/L5/4-tx-confirmed.png)

![Blockchain explorer shows successful transaction](https://react-to-web3-bootcamp.vercel.app/content/module-2/L5/5-tx-scanner.png)
