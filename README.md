# NEAR Omniwallet

The NEAR Omniwallet project aims to allow crypto users to execute transactions on any blockchain from any major wallet e.g. Bitcoin, EVM wallets.

We achieve this by asking the user to sign a message intent for a transaction to be executed on a destination chain. This intent and signature are passed to the Omniwallet contract that verifies the owner and exchanges the wallet signature of the intent for a signature of the transaction in the intent.

This library helps developers prepare intents, sign them with popular wallets and call the Omniwallet contract.

## Flow

1. User arrives at App
1. User wants to make a transaction on Chain Y
1. App uses Omniwallet library to prepare intent and ask user to sign
1. User signs intent (JSON) with wallet (from Chain X)
1. App uses Omniwallet library to broadcast intent, signature and the user's publicKey/address to the Omniwallet contract
1. Omniwallet contract verifies the user's publicKey/address from Chain X signed the intent
1. Contract encodes the intent into a transaction hash for Chain Y
1. Contract requests a signature from the NEAR Chain Signatures contract
1. Contract returns signature for Chain Y to App
1. App uses library to build the transaction from the intent
1. App uses library to broadcast transaction on Chain Y
1. App uses library to get transaction response from Chain Y

![image](https://github.com/user-attachments/assets/cd8f965a-780f-48bb-9dde-1fca7babec84)

# Resources

-   [Chain Abstraction Dev Group](https://t.me/chain_abstraction)

# Development Notes

-   [x] contract verify_owner
-   [x] bitcoin signing tests
-   [x] near contract call tests for bitcoin source and dest
-   [x] evm tests and contract calls
-   [ ] add NEAR and EVM transaction building client side
-   [ ] add test with signatures generated from okx and unisat
-   [ ] implement frontent for e2e wallet tests (frontend folder, parcel?)
