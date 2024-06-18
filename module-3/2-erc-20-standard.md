# The ERC-20 Token Standard

### Introduction

The ERC-20 token standard is a technical standard used for creating and implementing fungible tokens on the Ethereum blockchain. Introduced in 2015, it has become the most widely adopted standard for Ethereum-based tokens, ensuring that they can interact seamlessly with other smart contracts and decentralized applications (dApps) on the network.

At its core, the ERC-20 standard defines a common set of rules that all Ethereum tokens must adhere to.

### Essential functionality

The ERC-20 token standard defines essential functions and events that allow tokens to be transferred, balances to be queried, and total token supply to be obtained. Here are the key elements of the ERC-20 standard:

- totalSupply: This function returns the total supply of the token.
- balanceOf: Given an address, this function returns the balance of tokens held by that address.
- transfer: This function transfers a specified number of tokens from the sender's address to a recipient's address.
- approve: This function allows a spender to withdraw a set number of tokens from the owner’s account, up to a specified limit.
- allowance: This function returns the number of tokens that a spender is still allowed to withdraw from the owner’s account.
- transferFrom: This function transfers tokens from one address to another, using the allowance mechanism.

By adhering to these rules, ERC-20 tokens ensure compatibility with existing DeFi protocols, wallets, and exchanges, facilitating smooth integration and interaction across the Ethereum ecosystem.

### Interacting with ERC-20 Tokens

Interacting with ERC-20 tokens involves several common operations, such as querying token balances, transferring tokens, and approving and transferring tokens on behalf of others. These interactions are crucial for building functional DeFi applications and require a thorough understanding of how to work with smart contracts and the Ethereum blockchain.

1. Querying Token Balances: To display a user's token balance, you need to call the balanceOf function of the ERC-20 contract, passing the user's address as an argument. This function returns the balance of tokens held by that address.
2. Transferring Tokens: To transfer tokens from one address to another, use the transfer function. This function requires the recipient's address and the number of tokens to be transferred. The sender's address is implicitly the address of the account that signed the transaction.
3. Approving and Transferring Tokens on Behalf of Others: The approve function allows a user to authorize another address (a spender) to withdraw tokens from their account, up to a specified limit. The spender can then use the transferFrom function to transfer tokens from the user's account to another address. This mechanism is particularly useful for scenarios where automated or delegated token transfers are required.

These interactions are facilitated through smart contracts and require the use of tools and libraries like Viem and TanStack Query to handle blockchain queries and transactions. Proper handling of these interactions ensures that your application can manage tokens securely and efficiently.

### Components for ERC-20 functionality

Building a user interface to interact with ERC-20 tokens involves creating components that can display token balances and facilitate token transfers. Here's an overview of the key components you need to implement:

1. Token Balance Display Component: This component fetches and displays the user's token balance. It will call the balanceOf function of the ERC-20 contract and display the returned balance in the UI. The component should update in real-time or periodically to reflect changes in the user's balance.
2. Token Transfer Component: This component allows users to transfer tokens to another address. It should include input fields for the recipient's address and the number of tokens to transfer. Upon submission, the component should call the transfer function of the ERC-20 contract, handling any errors and providing feedback to the user about the transaction status.
3. Approval and TransferFrom Component: If your application requires more complex token transfer scenarios, such as automated payments or delegated transfers, you might also implement components for approve and transferFrom interactions. These components should allow users to set allowances and initiate transfers on behalf of other addresses. We will explore this pattern in the next module.

By integrating these components into your application, you enable users to manage their ERC-20 tokens directly from your DeFi frontend. Ensuring a seamless and secure user experience is key to building trust and adoption among your users.

### Next steps

Now that we understand the role that the ERC-20 token standard plays, we have identified the functionality that will allow us to execute token transactions. It's time to put that functionality to work, but how can we talk with a smart contract living on the EVM? We probably need an interface for it...
