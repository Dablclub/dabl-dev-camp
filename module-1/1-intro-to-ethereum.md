# Introduction to Ethereum

### What is Ethereum?

The computer science "**technical**" definition:

- **Ethereum** is a deterministic but practically unbounded state machine, consisting of a globally accessible singleton state and a virtual machine that applies changes to that state.

The **practical** definition:

- **Ethereum** is an open source, globally decentralized computing infrastructure that executes programs called smart contracts
  - Uses a blockchain to synchronize and store the system’s state changes
  - Uses a cryptocurrency called ether to meter and constrain execution resource costs

The **visual** definition:

- Imagine thousands of computers all over the world connected by the Internet...
  - Each runs same computer program, always! These are the nodes…
  - This program sets out rules (consensus!) for how the computers should work together
    - How to talk to each other? How to store data? How to decide what is what…
- In a real sense, it is one computer. **This computer is Ethereum**.

The above concept is extremely important to learn! Ethereum = A Computer. That's it! It's just a big ole' fancy decentralized computer! 🤯 Let's break it down even further...

### Ethereum = a computer

![Ethereum is a computer](https://react-to-web3-bootcamp.vercel.app/content/module-1/L1/1-ethereum-a-computer.png)

That's right. Ethereum can be seen just like any other consumer computer that we know! The thing is, the Ethereum computer isn't actually that fast. In fact, code execution on the Ethereum computer is 5-100x slower than typical compiled code on other machines. It's also quite expensive to use! Adding 5+5 is a lightning flash calculation even on phones... adding 5+5 in Ethereum can cost a few dollars. Basically, the Ethereum computer's basic computation, storage and memory costs mirror those of a 1950's computer.

### Properties of the Ethereum Computer

Ok, so Ethereum is a computer that can't even keep up with all the other modern PCs, why would I want to use it?! Let's look at some properties of the Ethereum computer that make it actually useful...

1. Ethereum = Truly Global Singleton
   Ethereum is possibly the first global singleton computer ever, that is fundamentally not localized (meaning, it's not located in any one single location). All other computers are either physical machines (laptops) or virtual machines, which reside in physical machines.

Ethereum does not reside in any single machine, no physical presence in any part of the world… yet there is only one!

Take a minute to really internalize the above statement! 🤯

2. Censorship Resistance
   No authority, government or corporation is behind the Ethereum computer. No one owns it, can shut it off or can use it as an advanced user (ie. a system administrator in a typical client-server setup).

3. Ethereum = Ubiquitous & Accessible
   Where there is Internet, there is Ethereum. There are no barriers to participation. If you can connect to WiFi, you can interact with the Ethereum computer. If you want to write to the Ethereum computer, you'll just need some ETH on top of an Internet connection - to pay gas! So, the Ethereum computer is ubiquitous (everywhere!).

In terms of accessibility, Ethereum's main smart contract programming language is currently Solidity - a language with strong similarities in design to JavaScript. JS is the programming language that powers the Internet. Therefore, the learning curb for new Ethereum devs is not that particularly difficult - it's very similar to the most popular programming language on the planet. This means the Ethereum computer is not hidden behind layers of complexity, it is accessible, as a start, to anyone that knows (or learns!) JavaScript.

4. Ethereum = Natively Multi-User
   The Ethereum computer, thanks to the wide input range of the [`keccack256`](https://emn178.github.io/online-tools/keccak_256.html) hash function, has a practically infinite range possible for account creation. The range is 2^160, a number so incredibly large, that our puny human brains cannot even comprehend it.

Basically, the Ethereum computer can supply as many accounts as we'll ever need - and then more. Try creating a new account now, easy as pie!

[Here's a cool video](https://www.example.com) that breaks down such large number ranges used in cryptography! 🎥

5. Ethereum is Verifiable & Auditable
   Any code deployed onto the Ethereum computer is honored now and forever. Smart contracts inherit the cryptographic properties of the Ethereum computer: immutability, censorship-resistance and verifiability. Once you deploy a smart contract, unless you explicitly code in a clause with a call to `selfdestruct`, that contract will live on the Ethereum computer FOREVER. No one can change it, not even Vitalik.

### So... Why Ethereum?

The Ethereum platform enables developers to build powerful decentralized applications with built-in economic functions, while providing high availability, transparency, and neutrality.

The point of Ethereum isn’t to be fast or cheap, the point is to be trustworthy. Any program that runs on the Ethereum computer is guaranteed to run the same way everywhere, on every node. Data stored on the Ethereum computer is available everywhere, and it is permanent. Now that's a cool computer right there!

### Ethereum vs. Bitcoin

One of the key differences between Ethereum and Bitcoin is that Ethereum has a virtual machine built into it that supports **Turing-Complete** languages, which means developers can build arbitrary applications and programs on top of it.

In contrast, Bitcoin's [Script](https://en.bitcoin.it/wiki/Script) language is **purposefully restricted** to simple true/false evaluations of conditions correlating to whether or not a UTXO can be spent. It does not allow for **loops**.

Note that adding loop functionality is not particularly difficult, it's simply a matter of adding a conditional jump (i.e. if this condition is true, go to this line of code).

Programs written in Turing-complete languages have a property that makes it impossible to tell if those programs will ever terminate. Alan Turing proved it is generally impossible to do so, known as [The Halting Problem](https://en.wikipedia.org/wiki/Halting_problem).

Let's consider the following JavaScript code:

```
    for(let i = 0; i >= 0; i++) {
      console.log(i);
    }
```

Looking at the conditions, we can see that this loop will never terminate. If we tried to run similar code on Ethereum, what would happen?

A miner would receive the transaction, add it to their transaction memory pool, mine a block, add the transaction to the block, and then broadcast that block to the network. Now, all the other nodes in the network will try to run the transaction on their own machine, they will be stuck in an infinite loop!

In order to prevent such attacks from occurring, Ethereum designed its own Virtual Machine to run transactions within. Let's take a deeper look at the **Ethereum Virtual Machine (EVM)**.

**Other differences between Ethereum and Bitcoin**

|                         | Ethereum                                                         | Bitcoin                     |
| ----------------------- | ---------------------------------------------------------------- | --------------------------- |
| Consensus Mechanism     | Proof of Stake                                                   | Proof of Work               |
| Accounting System       | Account Model                                                    | UTXO Model                  |
| Public Key Cryptography | secp256k1 elliptic curve                                         | secp256k1 elliptic curve    |
| Stale/Orphan Blocks     | Rewarded (Ommer Blocks)                                          | Not Rewarded                |
| Block Time              | Approx every 12 seconds                                          | Approx every 10 minutes     |
| Network Difficulty      | Adjusted every block                                             | Every 2016 blocks           |
| Language Support        | Turing Complete smart contracts, custom VMVM operations cost gas | non-Turing Complete scripts |

### The Ethereum Virtual Machine

A Virtual Machine is a program that emulates a particular environment for code to run in.

For instance, if you wanted to run macOS on Windows, you could download a virtual machine that would emulate the macOS environment. In this case, the virtual machine emulates a hardware architecture.

Another Virtual Machine you may have heard of is the Java Virtual Machine. The JVM allows developers to write Java code on different machines without worrying about the underlying details of computer architecture. Write once, run everywhere. In this case, the JVM emulates a particular software environment.

The EVM is similar to the JVM. In fact, the JVM was considered as an option to build Ethereum on top of before development began on the EVM! The problem is, the EVM had very specific requirements in order to run on a decentralized blockchain. Take, for example, that infinite loop from the previous section:

```
    for(let i = 0; i >= 0; i++) {
        console.log(i);
    }
```

How could we create an environment in which code like this would not be able to run infinitely?

It turns out the simplest way to do this is by adding a monetary **cost** to each **operation**. This cost on Ethereum is known as **gas**.

### Gas

Gas is a measurement of the cost to each operation that relates to the computational cost that the operation incurs on the network. So if you are making every node in the network do some kind of computationally expensive task every time they need to verify your transaction, you'll need to pay for significantly more than a simple transaction that is sending money from one individual to another.

We learned about expressions and statements in JavaScript. An operation in assembly code is lower level, which means it describes a much simpler task. For example, storing/loading a value in memory require its own operation in most assembly languages.

The Ethereum Virtual Machine has a [list of operation codes with a corresponding gas cost](https://github.com/crytic/evm-opcodes) (partially displayed below).

![Ethereum opcodes](https://react-to-web3-bootcamp.vercel.app/content/module-1/L1/2-ethereum-opcodes.png)

Even though the above gas costs are **fixed**, the actual **price** of gas is ever changing. This is similar to how literal gasoline works: cars have a “fixed” cost for the amount of gas they need to get from A to B but the price of that gas is ever-changing. We’ll learn more about this in the next article: Gas on Ethereum.

We can split these operations up into a several categories:

- Arithmetic (i.e. `ADD`, `DIV`, etc.)
- Information about the current context of the transaction (i.e. `TIMESTAMP`, `CALLVALUE`, etc.)
- Operations that manipulate/retrieve from **temporary memory** (i.e. `MSTORE`, `PUSH32`, etc.)
- Operations that manipulate/retrieve from **persistent memory** (i.e. `SSTORE`, `CREATE`, etc.)
- Control Flow Operations that provide us with **loops** (i.e. `JUMP`, `JUMPI`, etc.)

You can see that operations that create or modify persistent data on the blockchain have significantly more costs associated with them than simple arithmetic operations. For example `ADD` requires `3` gas, while using `SSTORE` can require `20000` gas. Even the operation `BALANCE` has significant costs associated with it (`700` gas) because it requires a lookup in persistent memory.

Quick note on _persistent_ versus _temporary_ memory. Temporary memory only exists for the extent of the transaction. It's like creating a variable inside a function in JavaScript. Once that function has completed, the variable is inaccessible. On the other hand, persistent memory lives on after the function call. You can read the state of this variable at any block by querying an Ethereum node.

You might be wondering how they came up with such specific gas costs. Benchmarking certainly helps for this, although in some ways this can be a [bit of a guessing game](https://eips.ethereum.org/EIPS/eip-150). The goal is to find a gas cost that is representative of the amount of strain the operation takes on the network. All operations on the blockchain, as well as storage of persistant data, are run on every full node in the entire Ethereum Network.

In the past, attackers have attempted to exploit any discrepancies between computationally expensive operations and their associated gas costs. These attacks are referred to as **denial of service** attacks because they'll slow the network to a crawl and essentially deny users of the service. Due to this, Ethereum has had to upgrade the VM at times in order to adjust gas costs.

How does a decentralized network upgrade a Virtual Machine running on thousands of machines? Glad you asked! Let's learn about **Forks**.

### Understanding Forks

Part of the philosophy of Ethereum is to move fast and embrace change. As such, Ethereum was designed with the ability to conduct upgrades, and built in a process for suggesting improvements to the system. Each update is specified in an [Ethereum Improvement Proposal](https://eips.ethereum.org/) or **EIP** for short! Anyone can suggest standards for Smart Contracts like the popular [EIP20 Token Standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) or changes to the Virtual Machine itself like this [addition of the DELEGATECALL opcode](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7.md). Updates to the VM require forks. To understand why, let's consider how the EVM works.

The Ethereum Virtual Machine is first and foremost **a specification**. This means that it is outlined in a formal paper called [The Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf). Several teams used this specification and implemented the EVM in different languages. Each of these EVM implementations is called an **Ethereum Client**. Two commonly used Ethereum clients today are [Erigon](https://github.com/ledgerwatch/erigon) and [Geth](https://geth.ethereum.org/docs/getting-started) both written in Go ([Parity](https://github.com/openethereum/parity-ethereum) used to be a popular client but was deprecated in 2020). There are many other clients in different languages that you can explore [here](https://ethereum.org/en/developers/docs/nodes-and-clients/).

For a good example to drive the point home, check out how the `ADD` operation is implemented by Geth [here](https://github.com/ethereum/go-ethereum/blob/3bb9b49afb17ae4e66f52adba359670078883dcb/core/vm/instructions.go#L40-L46). This code is written in Go, but it should still look a bit familiar! The `ADD` operation is specified in the Ethereum Yellow Paper and then the client (in this case Geth) can choose to implement it however they like so long as it adheres to the specification!

Some upgrades to the Ethereum Virtual Machine are planned and others are impromptu responses to attacks. Either way, when these changes are to be adopted a **fork** occurs. This is because active nodes need to update their client with the latest changes specified by the EIPs. It's called a fork because some nodes may choose to update their client version while others may choose not to.

You may have heard the terms hard fork and soft fork for blockchains before. The difference between these terms is that a soft fork is backwards compatible (the older version can still be used) while a hard fork is not.

In most cases, all clients update and the new changes are successfully adopted. Many of these upgrades were planned far in advance and make objectively good upgrades to the system. [Tangerine Whistle](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-608.md) is a good example of a Hard Fork in response to a Denial of Service attack that was adopted fully by the community. This Hard Fork modified the gas costs of [specific operations](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md) to ensure that were more reflective of the computational load required by the network.

In other cases, especially updates that have **political implications**, clients may not adopt the new changes and may even fork client implementations. This is what happened in the case of the [the DAO Fork](https://eips.ethereum.org/EIPS/eip-779) which was a particularly contentious fork splitting the network into two competing blockchains: Ethereum and Ethereum Classic. You can see an example of a forked client by looking at [the version of Geth](https://github.com/etclabscore/go-ethereum) that is maintained by the Ethereum Classic Labs.

Want to learn more about Hard Forks? Here's a [great list of all Ethereum Hard Forks](https://ethereum.stackexchange.com/questions/13014/summary-and-history-of-the-ethereum-hard-forks/13015#13015) since its initial release.

### Conclusion

Phew, that was a dense chapter!

Don't worry if some of it is still puzzling.

As we dive further into Ethereum, refer back to this section and we promise it will become more clear with time. Just remember, Ethereum = a computer!
