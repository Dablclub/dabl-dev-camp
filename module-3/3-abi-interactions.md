# Interacting with Smart Contracts

Previously, we created a component that allows users to send ETH to any valid EVM address. Let’s remember that both Polygon zkEVM and the Cardona testnet use ETH as their native currency.

In other words, we’re accessing an onchain asset, ETH, which is natively programmed into the EVM. This means that we can get balances and transfer it without any specific configuration. This is not the case with ERC-20 tokens, which are smart contracts that have a specific implementation.

So, let’s interact with an ERC-20 smart contract.

### Recap

In the previous section, we explored the ERC-20 token standard and how it defines a common set of rules for creating and managing fungible tokens on the Ethereum blockchain. With this foundation, we can now build more interactive and user-friendly features in our DeFi application. Specifically, we want to enable users to transfer ERC-20 tokens directly from our React frontend by creating a modal component. This component will load the user's ERC-20 token balance and allow them to enter an address and amount for the transfer.

To achieve this, we need to understand how to interact with smart contracts on the blockchain. This is where Application Binary Interfaces (ABIs) come into play. ABIs are essential for communicating with smart contracts and invoking their functions from our frontend.

### What is an ABI?

An Application Binary Interface (ABI) is a standardized way for applications to interact with smart contracts on the Ethereum blockchain. Essentially, an ABI is a JSON array that describes the functions and events of a smart contract, including their inputs, outputs, and data types. When you deploy a smart contract, the ABI serves as a bridge between the contract's bytecode on the blockchain and the external applications that wish to interact with it.

ABIs provide a clear interface for calling contract functions, allowing developers to encode and decode data when sending transactions or querying the blockchain. They ensure that the data passed to and from the smart contract is correctly formatted and interpreted.

**Why do ABIs exist?**

Smart contracts are the core applications of the EVM (Ethereum Virtual Machine). The purpose of smart contracts is to execute transactions when certain conditions defined in the contract are met. These conditions can be events both on or off-chain. Smart contracts are written in high-level languages like Solidity but they are stored on the EVM as executable bytecode, which is in binary format.

![Showing how the ABI communicates the frontend with the blockchain](https://react-to-web3-bootcamp.vercel.app/content/module-3/L3/1-abi-translates.png)

Source: Alchemy

Since this bytecode is not human readable, it requires interpretation to be understood. ABI allows anyone writing a smart contract to be able to communicate between a web application written in a high-level language like Javascript and the bytecode that the EVM understands.

![Event and function specification inside an ABI](https://react-to-web3-bootcamp.vercel.app/content/module-3/L3/2-abi-specs.png)

Source: Alchemy

Unlike an API, we can't just send a request directly in JSON format to a smart contract and expect a response since a contract only communicates in bytecode. To translate this into something the EVM understands, this information is encoded via ABI encoding. These encodings include function signatures and variable declarations so that the EVM knows exactly which function to execute within the smart contract.

![Smart contract creation bytecode](https://react-to-web3-bootcamp.vercel.app/content/module-3/L3/3-contract-bytecode.png)

The responses are also in the bytecode so interpretation is required before it is processed by a web application. The advantage of using bytecode in the response is that we can also expect a certain structure to be returned after calling a contract's function.

### How to Use ABIs to Interact with Smart Contracts

Using ABIs, we can perform various operations on smart contracts, such as reading data, writing data, and listening for events. For our ERC-20 token transfer feature, we will focus on invoking functions to fetch token balances and execute token transfers.

To implement this functionality in our React frontend, we'll follow these steps:

1. **Loading the ERC-20 Token Balance:**
   We'll use the balanceOf function from the ERC-20 contract's ABI to fetch the user's token balance. This function takes the user's address as an input and returns the balance of tokens held by that address.

2. **Creating the Transfer Modal:**
   We'll design a modal component that includes input fields for the recipient's address and the amount of tokens to transfer. The modal will also display the user's current token balance for reference.

3. **Transferring Tokens:**
   The modal will invoke the transfer function from the ERC-20 contract's ABI to execute the token transfer. This function requires the recipient's address and the amount of tokens to transfer as inputs.

To ensure the entered amount is correctly formatted, we'll use the parseEther utility from Viem. This utility converts human-readable ether values (e.g., "1.5") into the appropriate format used by smart contracts.

4. **Handling Approvals (Optional):**
   If our application involves scenarios where another contract or address needs to spend tokens on behalf of the user, we'll use the approve function. This function allows the user to authorize a spender to withdraw tokens up to a specified limit from their account.

By understanding and utilizing ABIs, we can seamlessly integrate smart contract interactions into our React frontend. This enables us to provide users with a powerful and intuitive interface for managing their ERC-20 tokens.

### Next steps

We have the theory down, it's time to get technical. In the next lesson, we will explore a custom ERC-20 token we created, where we will be able to mint some initial tokens and transfer them to any address we desire, creating a modal component with this functionality.
