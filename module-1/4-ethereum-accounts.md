# Accounts in Ethereum

There are two types of accounts in Ethereum: **externally owned accounts** and **contract accounts**.

### Externally Owned Accounts

Externally Owned Accounts (or **EOAs** for short!) are similar to Bitcoin private/public key pairs. In both models, the address and public key are associated to a private key via an Elliptic Curve Digital Signature.

However, the method to get from a private key to an address in Ethereum is different than Bitcoin. The resulting address in Ethereum is a 40 character hexadecimal string as opposed to a 26-35 alphanumeric string in Bitcoin.

Another difference is that Bitcoin addresses end in a [checksum](https://en.wikipedia.org/wiki/Checksum) to ensure the address is typed properly. Ethereum addresses don't have a checksum by default, although [EIP-55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md) introduced a capitalization scheme that can be validated by wallet software.

The **biggest difference** between EOAs and Bitcoin Addresses is that EOAs have a **balance**. This means that the global state of the blockchain actively tracks how much ether every **active** address on the network holds.

Minor clarification here: an **active** address refers to an address that has interacted on the Ethereum blockchain. There are technically 16^40 (or 2^160 if you're thinking in binary!) possible Ethereum addresses which can be generated. These addresses are not included in the global state tree until they have interacted with the blockchain. Otherwise, this would be a massive amount of data stored! Take a look at [EIP-161](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md) which was implemented when flaws in the Ethereum system allowed an attacker to create **19 million accounts** at extremely low gas costs.

### Accounts vs UTXOs

To transfer value in Bitcoin we spend UTXOs. In Ethereum there are no UTXOs. Instead, at the end of a transaction transferring **ether**, the transferred amount is subtracted from the sender's address balance and added to recipient's address balance in the global state tree.

Compared to UTXOs, an account balance is quite straightforward, especially from an application developer perspective. The EVM has an operation `BALANCE` that allows us to look up an addresses balance inside code running on the EVM. This is much simpler than adding all unspent transaction outputs that have a particular address as their recipient.

Each Ethereum address also contains a **nonce**. The nonce keeps a count of all transactions sent from that particular address. To understand why this is necessary, let's consider an example.

Let's say you have 2 ether in your account and you want to send 1 ether to Bob:

    {
        to: BOBS_ADDRESS,
        value: 100000000000000000 // 1 ether
    }

You'll be able to broadcast this transaction to the network once you sign it with your private key.

At that point, with the current parameters specified, what's stopping Bob from re-transmitting this same transaction again to the network?

**NOTHING**

To combat this, Ethereum tracks the number of transactions sent by an account, called the account nonce. Each time a transaction is sent, the nonce is incremented:

    {
        to: BOBS_ADDRESS,
        value: 100000000000000000, // 1 ether
        nonce: 0x0 // this is the first transaction, nonce is zero!
    }

If Bob tried to re-broadcast the transaction now, the network would reject it. Once the first transaction is successfully mined the miners enforce the rule that the nonce of your next transaction should be `0x1`.

You may be thinking: "What if Bob tried to increment the nonce himself?" But, of course, Bob would need you to sign the transaction after he incremented the nonce. The result of a digital signature does not leave room for the underlying data to be tampered with.

The word "nonce" simply means it's **a number we're using once** for its particular purpose. It's a rather ambiguous term. Accounts in Ethereum have a nonce that keeps a count of transactions to be used once per transaction. Blocks in Proof of Work have a nonce that allow it to randomly search for a valid hash to be used once in the search for that block hash.

To summarize, the difference between Ethereum EOAs and Bitcoin addresses is that active EOAs are stored with a **balance** and a **nonce**. Whereas in Bitcoin the client only keeps track of **UTXOs** which contain an owner address.

For more reasons why Ethereum chose accounts instead of UTXOs, it's best to refer to the [Design Rationale](https://ethereumbuilders.gitbooks.io/guide/content/en/design_rationale.html) document in the Ethereum wiki.

### Contract Accounts

Finally, we broach the most exciting part of Ethereum: **Smart Contracts**!

The term **Smart Contract** sounds pretty intimidating at first glance. Don't worry about the name, it's simply **a program that runs in the blockchain execution environment**.

As a developer, you would write a **Smart Contract** when you want to decentralize a program's execution. Smart Contracts are generally written in a high-level language like **Solidity** or **Vyper**. Once you've completed the code (and tested it thoroughly!) you can deploy the contract to the Ethereum blockchain. You can do so by running a transaction from your Externally Owned Account with the **bytecode** of the compiled smart contract.

This contract has its own **account** in that it also has a **balance** and **address**. The contract account cannot be controlled by a private key like a EOA. Instead, EOAs make transactions to call functions on the contract. From there, contracts can also make calls to other contracts synchronously. Once a contract is deployed, the **code cannot be changed**. However, the **storage** (persistent memory) of a contract can be updated through transactions.

A contract can store an address of another contract that it needs to interact with. Since the address is held in **storage** it can be updated through transactions. Therefore it's possible to upgrade a system by deploying new contracts and running a transaction to update references to point to the new addresses. This can be a bit of a challenging subject and is generally referred to as smart contract **upgradeability**.

### Wrap Up

In this article we discussed both types of accounts on Ethereum: **Externally Owned Accounts** and **Contract Accounts**. We talked about some of the differences between an account-based model and a UTXO model.

We also briefly touched on Smart Contracts from a high-level perspective, we'll dive into these concepts further when we start programming our own smart contracts!
