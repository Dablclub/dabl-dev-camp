# Proof of Stake

On September 15th, 2022 Ethereum transitioned from Proof of Work to Proof of Stake (POS), also known as “The Merge”. This was a massive migration that was always in the roadmap and original planning for Ethereum, but required coordination from the entire network to execute.

We learned about Proof of Work, the consensus mechanism used by Bitcoin and previously Ethereum in week 1. Proof of Stake is a totally different mechanism that enables Ethereum to be:

1. More secure 🔒
2. Less energy intensive 🌎
3. Greater scalability 📈

Let’s unpack how PoS works to understand why this is the case.

### How PoS works

In order to become a miner in PoW, there are large energy requirements, which makes it difficult for any individual to compete with the existing mining warehouses that are dedicating millions of dollars of resources to mining.

However, in Proof of Stake, the energy requirement to become a validator is much lower and can be done by individuals without a high overhead energy cost. This encourages more users to become validators, decreasing the centralization risk, and thereby increasing the security of the network.

Instead of using mass amounts of electricity, validators are required to **stake** 32ETH by depositing it into a contract to have the ability to validate blocks. This staked ETH is used as collateral against bad actors in the network. If any given validator acts dishonest or malicious they put themselves at risk of losing their staked ETH.

Rather than all validators competing at the same time for the next block, the network randomly selects a validator to propose a block every 12 seconds, all the other validators verify that the proposed block is correct, and the cycle repeats.

This means that the energy requirements to mine any given block are significantly lower than that of PoW.

💡There are a lot more really interesting mechanisms for PoS, but rather than discuss them here we’re going to move onto how this new system affects Ethereum developers (like yourself!). If you’re interested in learning more about PoS and the Merge check out the Additional Resources section below.

### How PoS affects Ethereum Development

One of the largest ways that PoS affects Ethereum developers is with a new framework for block **finality**. Finality in blocks refers to how confident you are that the given block will not change or get forked away. For blocks that have been on the network for a very long time (older blocks) it is extremely unlikely that it will be removed from the canonical chain and therefor has high finality.

Proof of Stake introduced 2 new levels of finality that developers should consider when requesting data from the network: `safe` and `finalized`. Here is an overview of all “block tags”:

1. `earliest`: The lowest numbered block the client has available. Intuitively, you can think of this as the first block created.
2. `finalized`: The most recent crypto-economically secure block, that has been accepted by >2/3 of validators. Typically finalized in two epochs (64 blocks). Cannot be re-orged outside of manual intervention driven by community coordination. Intuitively, this block is very unlikely to be re-orged.
3. `safe`: The most recent crypto-economically secure block, typically safe in one epoch (32 blocks). Cannot be re-orged outside of manual intervention driven by community coordination. Intuitively, this block is “unlikely” to be re-orged.
4. `latest`: The most recent block in the canonical chain observed by the client, this block may be re-orged out of the canonical chain even under healthy/normal conditions. Intuitively, this block is the most recent block observed by the client.
5. `pending`: A sample next block built by the client on top of latest and containing the set of transactions usually taken from local mempool. Intuitively, you can think of these as blocks that have not been mined yet.

To remember the differences between the block tags you can think of them in the order of oldest to newest block numbers: `earliest` ≤ `finalized` ≤ `safe` ≤ `latest` ≤ `pending`

### Making requests

There are several methods that take in a **block number** or **block tag** as a parameter when requesting data on-chain. You’ll want to keep block finality in mind when requesting newer information. We’ll learn more about JSON-RPC requests later on this week.

### Additional Resources

- [Proof of stake (POS)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
- [The Merge](https://www.alchemy.com/the-merge)
- [The Ethereum Developer Guide to the Merge](https://docs.alchemy.com/reference/ethereum-developer-guide-to-the-merge)
