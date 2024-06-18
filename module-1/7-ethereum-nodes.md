# Ethereum Nodes

Ethereum nodes are what maintain the integrity and data on the network. There are several different types of Ethereum nodes that are participating in the network and are used depending on what type of data is needed.

**Full nodes** store and validate all blocks and transactions over the entire blockchain locally. When a smart contract transaction is executed, Ethereum full nodes execute all of the instructions in the smart contract. Together, full nodes determine whether the smart contract execution is producing the desired result. However, running full Ethereum nodes is expensive to and can consume a great deal of energy.

Luckily, Alchemy provides access to all archive data (from block 0) and latest data (from the most recent and pending blocks) completely for free.

### Understanding Ethereum Nodes

In the below video we will break down how nodes work, why they can be extremely challenging for applications at scale, and how to solve data consistency issues.

[Link to YouTube video](https://youtu.be/wMw6GPIrw20?si=DO7gZIvwSqYa2IW6)

### Bonus Material: Data Storage

We've talked about Ethereum Nodes storing information locally, although we haven't really talked about **how** they store the data locally. Let's take a closer look.

Ethereum stores data in Merkle Patricia Tries. The term "trie" seems to have originated from the term "retrieval". It is used quite interchangeably with the word "tree" and is often pronounced the same way.

**Merkle Patricia Tries retain the properties of the Merkle Tree**. The root hash of the trie represents the entirety of its contents (if any data changes, the root is completely different). Also, data can be proven to be part of a Merkle Patricia Trie without providing all of the data.

In addition to the Merkle Tree properties, the Merkle Patricia Trie has some major performance benefits for storing large amounts of data. You can find the full specification of the [Patricia Tree here](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/) as well as the [design rationale here](https://ethereumbuilders.gitbooks.io/guide/content/en/design_rationale.html).

There are four types of tries used to store data in **Ethereum**:

- **State Trie** - This is the global state of the Ethereum network. There is only one state trie and it is constantly being updated by transactions when they are mined into the blockchain.

- **Storage Trie** - Each account has its own storage trie. This keeps track of all persistent variables within a contract account, also known as its storage.

- **Transactions Trie** - There is one transactions trie per block and it contains all of the transactions in a specific order determined by the miner.

- **Receipts Trie** - For each transaction, a receipt is stored that contains logs, gas used and post-transaction state. This receipts trie stores all of that data.
  That's quite a lot of trees!

Don't worry about memorizing this information; you will likely never need to interface with these tries directly. Either you'll invoke an opcode on the EVM when you write a Smart Contract or you'll use the **JSON-RPC** API (often with the assistance of a library) to interact with an Ethereum Node on a much higher-level.

### Wrap Up

We discussed the potential issues you might run into with Ethereum nodes and how data is stored on full nodes, which is admittedly pretty intense!

Much of the Ethereum system is designed around incentives on how these nodes are able to store and validate transactions, so this is an important thing to keep in mind!

In upcoming lessons we'll be moving more high-level. We'll start to interact with these nodes and learn to use libraries to make our lives easier as developers.
