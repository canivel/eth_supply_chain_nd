# Ethereum DApp for Tracking Items through Supply Chain

# Introduction

This project consists in a decentralized application (DApp) of a supply chain solution backed by the Ethereum platform.

**Important**: The project was made with the versions below:

## Truffle v5.4.0 (core: 5.4.0)
#### TRUFFLE OVERVIEW
A world class development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM), aiming to make life as a developer easier. With Truffle, you get:

- Built-in smart contract compilation, linking, deployment and binary management.
- Automated contract testing for rapid development.
- Scriptable, extensible deployment & migrations framework.
- Network management for deploying to any number of public & private networks.
- Package management with EthPM & NPM, using the ERC190 standard.
- Interactive console for direct contract communication.
- Configurable build pipeline with support for tight integration.
- External script runner that executes scripts within a Truffle environment.

## Web3.js - 1.3.4
The web3.js library is a collection of modules that contain functionality for the ethereum ecosystem.

Simply, it provides us with an API to use so we can easily work with the blockchain. Web3 works as a wrapper for JSON RPC to connect to a remote or local Ethereum node with either a HTTP or IPC connection. Web3 is basically a connection between the Ethereum blockchain and your smart contract.

## Solidity - 0.8.3 (solc-js)
Solidity is an object-oriented programming language for writing smart contracts. It is used for implementing smart contracts on various blockchain platforms, most notably, Ethereum.

**Important**: The project didn't use any external **libraries** worth mentioning and also didn't use **IPFS** to host the frontend part decentralized as well.

# UML


![activity](./diagrams/activity.png)

![classes](./diagrams/classes.png)

![sequence](./diagrams/sequence.png)

![state](./diagrams/state.png)


### Getting Started

1. Clone this repository.
2. Install the dependencies with [NodeJS](https://nodejs.org/en/) and NPM.
3. Test the application making calls to the contract on the [Rinkeby Test Network](https://rinkeby.etherscan.io/).
4. Take a look at the transactions happening on the Rinkeby Test Network at [Etherscan](https://rinkeby.etherscan.io/) explorer.


**Important**: You will need your personal passphrase from your Ethereum account to publish into the Rinkeby Test Network, hence the **.secret** file in the **truffle-config.js**, even tough being a test network.

### Instructions

1. Install the dependencies:

```powershell
  npm i
```

2. Turn on the Ganache suite so that you will have pre-defined accounts to test the contracts:


3. Migrate, compile and test the contracts with truffle (on a separate console). It will use the previously up and running ganache locally blockchain.

```powershell
  truffle migrate
  truffle compile
  truffle test
```

![state](./diagrams/tests.png)

4. Publish the contracts into the Rinkeby Test Network with your Infura key:

```powershell
  truffle migrate --reset --network rinkeby
```

5. Check out and test the DApp in the frontend with the command below. You can run on the ganache-cli window, since Ganache was only for testing purpose.

```powershell
  npm run dev
```
### Output

Etherscan info:

- Transaction ID: [**0x9f15ea1856b12533b31e0cd695ae20baa88ab3b0df0cde3c09a6f3501d0ab694 **](https://rinkeby.etherscan.io/tx/0x9f15ea1856b12533b31e0cd695ae20baa88ab3b0df0cde3c09a6f3501d0ab694 )
- Contract: [**0x782d9E8557eb4ccAf63922Db67829861F5Db2Dc2**](https://rinkeby.etherscan.io/address/0x782d9E8557eb4ccAf63922Db67829861F5Db2Dc2)
