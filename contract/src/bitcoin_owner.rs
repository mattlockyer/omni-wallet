use crate::*;
use near_sdk::base64::prelude::*;

const BITCOIN_SIGNED_MSG_PREFIX: &[u8] = b"Bitcoin Signed Message:\n";

pub fn require(pk: &str, msg: &str, sig: &str) {
    require!(
        is_owner(pk, msg, sig),
        "public key != recovered public key from msg hash and signature"
    );
}

pub fn is_owner(pk: &str, msg: &str, sig: &str) -> bool {
    let recovered_pk = recover_pk(msg, sig);
    let pk_bytes = decode(pk).unwrap();
    pk_bytes == recovered_pk
}

// msg arg is the NEAR TX to be encoded and signed by MPC
// recreate the bitcoin msg that was signed in the wallet
// tested: OKX Wallet
fn recover_pk(msg: &str, sig: &str) -> Vec<u8> {
    let mut msg_bytes: Vec<u8> = vec![];
    // this prefix is valid for OKX Wallet
    // WARNING: I HAVE SEEN DIFFERENT HEADERS!!!
    msg_bytes.push(BITCOIN_SIGNED_MSG_PREFIX.len() as u8);
    msg_bytes.extend_from_slice(&BITCOIN_SIGNED_MSG_PREFIX.to_vec());
    // https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_integer
    let msg_len = msg.len();
    if msg_len < 253 {
        msg_bytes.push(msg_len as u8);
    } else if msg_len < u16::max_value() as usize {
        msg_bytes.push(253);
        msg_bytes.extend_from_slice(&(msg_len as u16).to_le_bytes().to_vec());
    } else if msg_len < u32::max_value() as usize {
        msg_bytes.push(254);
        msg_bytes.extend_from_slice(&(msg_len as u32).to_le_bytes().to_vec());
    } else if msg_len < u64::max_value() as usize {
        msg_bytes.push(255);
        msg_bytes.extend_from_slice(&(msg_len as u64).to_le_bytes().to_vec());
    }
    // append the msg and double sha256 hash it
    msg_bytes.extend_from_slice(&msg.as_bytes().to_vec());
    let hash = env::sha256(&msg_bytes);
    let msg_hash = env::sha256(&hash);

    // get signature bytes and parity
    let sig_bytes = BASE64_STANDARD.decode(&mut sig.as_bytes()).unwrap();
    let sig = sig_bytes.as_slice()[1..].to_vec();
    let v = sig_bytes.as_slice()[0] - 31;

    // recover the public key using NEAR Protocol ecdsa ecrecover method
    let mut recovered_pk = env::ecrecover(&msg_hash, &sig, v, true).unwrap().to_vec();

    recovered_pk.truncate(32);
    // println!("{:?}", encode(recovered_pk.to_owned()));

    recovered_pk
}

#[test]
fn test_require() {
    let pk: &str = "a34b99f22c790c4e36b2b3c2c35a36db06226e41c692fc82b8b56ac1c540c5bd";
    let msg: &str = "hello world";
    let sig: &str =
        "H40CJYEMXDGDycutBG0TZyCkpGEcScOks6K+P08iOtegC9B1Unn/bU2m/IIdGvLhqF1FgaKASAdfKl3vpDZeqBc=";
    require(pk, msg, sig);
}
