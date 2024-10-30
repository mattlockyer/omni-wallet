use crate::*;

// To modify this example, you must generate your own const hashes for types and domains
// https://github.com/ethereum/EIPs/blob/master/assets/eip-712/Example.js
const PREFIX: [u8; 2] = [25, 1];
// Transaction(string intent)
// const HASH_TYPE: &str = "7ba9dafa0282ce98c292042d347d29ef04362e5734dc4781450b635428016ef5";
const HASH_TYPE: [u8; 32] = [
    123, 169, 218, 250, 2, 130, 206, 152, 194, 146, 4, 45, 52, 125, 41, 239, 4, 54, 46, 87, 52,
    220, 71, 129, 69, 11, 99, 84, 40, 1, 110, 245,
];
// { name: 'NEAR Trade Signatures', version: '1', chainId: 11155111 }
// const HASH_DOMAIN: &str = "9c828e762a2894a702b106a87e9cdb52358feb4de152868918057f5cf34e0dcf";
const HASH_DOMAIN: [u8; 32] = [
    156, 130, 142, 118, 42, 40, 148, 167, 2, 177, 6, 168, 126, 156, 219, 82, 53, 143, 235, 77, 225,
    82, 134, 137, 24, 5, 127, 92, 243, 78, 13, 207,
];

// requires address arg matches recovered address from ecdsa recover of msg, sig
// ethereum address arg MUST be lowercase
pub fn require(address: &str, msg: &str, sig: &str) {
    require!(
        is_owner(address, msg, sig),
        "public key != recovered public key from msg hash and signature"
    );
}

// requires address arg matches recovered address from ecdsa recover of msg, sig
// ethereum address arg MUST be lowercase
pub fn is_owner(address: &str, msg: &str, sig: &str) -> bool {
    let recovered_pk = recover_pk(msg, sig);
    let hash_pk: Vec<u8> = env::keccak256(&recovered_pk);
    let hash160: [u8; 20] = utils::vec_to_fixed(hash_pk[12..].to_vec());
    let recovered_address = encode(hash160);
    address[2..] == recovered_address
}

// msg arg is the NEAR TX to be encoded and signed by MPC
// recreate the ethereum msg that was signed in the wallet
// tested: MM + OKX Wallet
fn recover_pk(msg: &str, sig: &str) -> Vec<u8> {
    let mut values: Vec<u8> = vec![];
    // append consts
    values.extend_from_slice(&HASH_TYPE);
    // append msg
    values.extend_from_slice(&env::keccak256(msg.as_bytes()));

    let mut msg_wrapped: Vec<u8> = vec![];
    // append consts
    msg_wrapped.extend_from_slice(&PREFIX);
    msg_wrapped.extend_from_slice(&HASH_DOMAIN);
    // msg prefixed with type hash
    msg_wrapped.extend_from_slice(&env::keccak256(&values));

    // final msg hash
    let msg_hash = env::keccak256(&msg_wrapped);

    // get signature bytes and parity
    let sig_bytes = decode(sig[2..].as_bytes()).unwrap();
    let sig = sig_bytes[0..64].to_vec();
    let v = sig_bytes[64] - 27;

    // recover the public key using NEAR Protocol ecdsa ecrecover method
    let recovered_pk = env::ecrecover(&msg_hash, &sig, v, true).unwrap().to_vec();
    recovered_pk
}

#[test]
fn test_require() {
    let address: &str = "0xe91a48d0704b4b2f112c5664658bbf43d2ea20dd";
    let msg: &str = "hello world";
    let sig: &str =
        "0x0e3f0a5162eed363d64f35bcc7a8c770fd41a8664a815f90c16aa89dd598c2fc753900d358f9e7cb9e2231c12c0f92d3b092dfb8dfdc38b5fa38c278115cd2401c";
    require(address, msg, sig);
}
