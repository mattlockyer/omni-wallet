use hex::{decode, encode};
use near_sdk::{
    env::{self, keccak256, sha256},
    log, near, require, Gas, NearToken, Promise, PromiseOrValue,
};

mod bitcoin_owner;
mod bitcoin_tx;
mod ecdsa;
mod evm_owner;
mod evm_tx;
mod external;
mod near_tx;
mod utils;

impl Default for Contract {
    fn default() -> Self {
        Self {}
    }
}

#[near(contract_state)]
pub struct Contract {}

#[near]
impl Contract {
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
        // require msg was signed by source wallet
        match source.as_bytes() {
            b"bitcoin" => bitcoin_owner::require(&owner, &msg, &sig),
            b"evm" => evm_owner::require(&owner, &msg, &sig),
            _ => {
                log!("undefined source chain");
                return PromiseOrValue::Value(0);
            }
        };

        // logic for a protocol could be inserted here e.g. into the transaction payload to be signed or produce 2 signatures

        // get new signature from MPC for destination chain
        let result = match destination.as_bytes() {
            b"bitcoin" => {
                PromiseOrValue::Promise(bitcoin_tx::get_bitcoin_sig(owner, hash.unwrap()))
            }
            b"evm" => PromiseOrValue::Promise(evm_tx::get_evm_sig(owner, msg)),
            b"near" => PromiseOrValue::Promise(near_tx::get_near_sigs(owner, msg)),
            _ => {
                log!("undefined destination chain");
                PromiseOrValue::Value(0)
            }
        };

        result
    }

    // read only methods

    pub fn verify_owner(
        self,
        // public key (bitcoin) or address (evm)
        owner: String,
        msg: String,
        sig: String,
        source: String,
    ) -> bool {
        // require msg was signed by source wallet
        match source.as_bytes() {
            b"bitcoin" => bitcoin_owner::is_owner(&owner, &msg, &sig),
            b"evm" => evm_owner::is_owner(&owner, &msg, &sig),
            _ => {
                log!("undefined source chain");
                false
            }
        }
    }
}
