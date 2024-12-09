# NEAR Omniwallet using NEAR Chain Signatures (NCS)

The NEAR Omniwallet project aims to allow crypto users to execute transactions on any blockchain from any major wallet e.g. Bitcoin, EVM wallets.

We achieve this by asking the user to sign a message intent for a transaction to be executed on a target chain. This intent and signature are passed to the Omniwallet contract that verifies the owner and exchanges the wallet signature of the intent for a signature of the transaction in the intent.

This library helps developers prepare intents, sign them with popular wallets, call the Omniwallet contract, receive the target chain signature and broadcast the signed transaction.

# Development Notes

-   [x] contract and unit tests
-   [x] library tests
-   [x] bitcoin source
-   [x] evm source
-   [x] evm target
-   [x] relayer for NEAR contract call
-   [x] frontend

## Flow

1. User arrives at App
1. User wants to make a transaction on Chain Y (target chain)
1. App uses Omniwallet library to prepare intent and ask user to sign
1. User signs intent (JSON) with wallet (from Chain X the source chain)
1. App uses Omniwallet relayer to broadcast intent, signature and the user's publicKey/address to the Omniwallet contract
1. Omniwallet contract verifies the user's publicKey/address from Chain X signed the intent
1. Contract encodes the intent into a transaction hash for Chain Y
1. Contract requests a signature from the NEAR Chain Signatures (NCS) contract
1. Contract returns signature for Chain Y to App
1. App uses library to build the transaction from the intent
1. App uses library to broadcast transaction on Chain Y
1. App uses library to get transaction response from Chain Y

![image](https://github.com/user-attachments/assets/cd8f965a-780f-48bb-9dde-1fca7babec84)

## Getting Started

Create a `.env` file with the following:

```
REACT_APP_mpcContractId=v1.signer-prod.testnet
REACT_APP_omniContractId=forgetful-parent.testnet
REACT_APP_accountId=[YOUR_NEAR_ACCOUNT_FOR_RELAYING_NEAR_TXS]
REACT_APP_secretKey=[YOUR_NEAR_ACCOUNT_SECRET_KEY]
REACT_APP_relayerUrl=http://localhost:3000
```

A copy of this `.env` should be in the following locations:

```
/
/frontend
/backend
```

`REACT_APP_mpcContractId` must match the contract in `REACT_APP_omniContractId` (if you deploy your own copy of the contract, you can change the MPC contract).

`REACT_APP_accountId` is the NEAR Account that is used in your relayer to pay for the user's NEAR TX calls to the contract. This is also useful for debugging the library locally by calling the contract directly without the relayer. To do this remove `REACT_APP_relayerUrl` from your `.env`.

`REACT_APP_relayerUrl` you might choose to run your relayer from a different location. Included is the most basic backend relay. Other options include using Meta Transactions and Access Keys, depending on your use case.

## Install and Start

```
yarn
yarn build
cd frontend
yarn start
# another terminal
cd backend
yarn start
```

## NCS Derived Accounts (DAs) and Signatures

What is a derived account (DA)? A DA is an account on a blockchain with signatures created **only** by the NCS protocol. The signature is created by a secure multi-party computation performed the NCS. This account has no exportable private key.

### How to create a custom derived account

An NCS derived account is unique based on the following inputs:

The MPC Contract Id `x` The Calling Account Id (Omniwallet Contract) `x` A Unique Path Variable

The library exports:

```js
generateAddress(
	accountId: string,
	chain: string,
	path: string,
)
```

The `accountId` is the caller of the NCS and defaults to the `omniContractId` for the Omniwallet.

### How Omniwallet creates DAs

Omniwallet creates a unique DA using a `path` argument with 3 concatenated inputs:

1. The chain ID of the DA, this is the target chain the transaction will ultimately be executed on.
2. The public key (for bitcoin chains) or the address (for evm chains) of the wallet used to sign.
3. An optional offset e.g. 1, 2, 3, ... to generate multiple accounts per target chain x signing wallet.

Combining these 2 arguments ensures that by using Omniwallet, only signatures signed by the signing wallet and intended for execution on the target chain, will be valid.

# Resources

-   [Chain Abstraction Dev Group](https://t.me/chain_abstraction)
