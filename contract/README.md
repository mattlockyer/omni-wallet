# Omniwallet Contract

## The `verify_owner` method

This is a read method, no need to make a function call and use gas.

Use this method to test the client's signature is valid:

```rust
pub fn verify_owner(
	self,
	// public key (bitcoin) or address (evm)
	owner: String,
	msg: String,
	sig: String,
	source: String,
) -> bool {
```

The `source` argument is the signing wallet's chain type e.g. `bitcoin` or `evm`.

## The `trade_signature` method

This method will exchange the intent signed with the source chain wallet type for the destination chain wallet type.

e.g. source `bitcoin` and destination `evm`.

The steps:

1. Prove the source chain wallet signed the message
1. Get a signature for the derived account on the destination chain

Currently the derived account is generated using the `path` argument of the client's public key (bitcoin) or address (evm).

Taking a look at the method signature for trade_signature, the contract's public method:

```rust
pub fn trade_signature(
	&mut self,
	// public key (bitcoin) or address (evm)
	owner: String,
	msg: String,
	sig: String,
	source: String,
	destination: String,
	hash: Option<String>,
) -> PromiseOrValue<u8> {
```

## Example

Given arguments for source `bitcoin` and destination `evm`.

First, `bitcoin_owner::require(owner, msg, sig)` is called. This method will verify that the `owner` (a bitcoin public key) can be recovered from the `msg` signed by the provided `signature`.

Second, `evm_tx::get_evm_sig(owner, msg)` is called. The `msg` is parsed and encoded into an evm transaction. A cross contract call is made to the NEAR Chain Signatures contract with the path variable of `owner` creating a signature for a unique derived account. The cross contract call returns the promise to the contract and on to the client.

### `ecdsa.rs`

This is where the cross contact call to the NEAR Chain Signatures contract is.

### `evm_tx.rs`

This file has the `get_evm_sig(...)` method which takes the JSON msg that was signed and parses it using the Omni library. Once we have an `EVMTransaction` object we can get an RLP encoding of the transaction by calling `build_for_signing()`. Finally, we can get the transaction hash that needs signing by the NEAR Chain Signature MPC Contract call (`ecdsa.rs`) by taking the `keccak256` hash of the RLP encoded EVM transactions.

### `near_tx.rs`

Similar to `evm_tx.rs`

### `bitcoin_tx.rs`

For Bitcoin currently we simply pass through the hash of the input to sign. Using `bitcoinjs-lib` and creating Psbt's, the input hash will change if you change the output. So while this isn't technically a risk to the client, the preferred method would be to encode and hash the unsigned transaction that the client signed with the signing wallet.

## Development Notes

-   [ ] add custom path arg to verify_signature

# NEAR Contract Resources

## How to Build Locally?

Install [`cargo-near`](https://github.com/near/cargo-near) and run:

```bash
cargo near build
```

## How to Test Locally?

```bash
cargo test
```

## How to Deploy?

To deploy manually, install [`cargo-near`](https://github.com/near/cargo-near) and run:

```bash
# Create a new account
cargo near create-dev-account

# Deploy the contract on it
cargo near deploy <account-id>
```

## Useful Links

-   [cargo-near](https://github.com/near/cargo-near) - NEAR smart contract development toolkit for Rust
-   [near CLI-rs](https://near.cli.rs) - Iteract with NEAR blockchain from command line
-   [NEAR Rust SDK Documentation](https://docs.near.org/sdk/rust/introduction)
-   [NEAR Documentation](https://docs.near.org)
-   [NEAR StackOverflow](https://stackoverflow.com/questions/tagged/nearprotocol)
-   [NEAR Discord](https://near.chat)
-   [NEAR Telegram Developers Community Group](https://t.me/neardev)
-   NEAR DevHub: [Telegram](https://t.me/neardevhub), [Twitter](https://twitter.com/neardevhub)
