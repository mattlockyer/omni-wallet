use crate::*;

pub fn get_bitcoin_sig(path: String, hash: String) -> Promise {
    let payload = decode(hash).unwrap();
    ecdsa::get_sig(payload, path.to_owned(), 0)
}

// use omni_transaction::bitcoin::bitcoin_transaction::BitcoinTransaction;
// use omni_transaction::bitcoin::types::EcdsaSighashType;

// pub fn get_transaction(data: String) -> BitcoinTransaction {
//     BitcoinTransaction::from_json(&data).unwrap()
// }

// pub fn get_bitcoin_sig(path: String, json: String) -> Promise {
//     let tx = get_transaction(json.to_owned());
//     let encoded = tx.build_for_signing_legacy(EcdsaSighashType::All);
//     let payload = sha256(&encoded);

//     log!("hex payload sha256 hash {:?}", encode(payload.to_owned()));

//     ecdsa::get_sig(payload, path.to_owned(), 0)
// }

// #[test]
// fn test_bitcoin_tx() {
//     let json = r#"
//         {"version":2,"lock_time":0,"input":[{"previous_output":{"txid":"156447308536652d8d00eda432e96ed10de94cb718cc14e32be3b8a0d184ae42","vout":0},"script_sig":[],"sequence":4294967295,"witness":[]}],"output":[{"value":1,"script_pubkey":"76a9146cdfe987f2114d995526d0ee3427a1208b2c740e88ac"},{"value":15782,"script_pubkey":"76a9146cdfe987f2114d995526d0ee3427a1208b2c740e88ac"}]}"#;

//     let tx = BitcoinTransaction::from_json(json).unwrap();

//     let encoded = tx.build_for_signing_legacy(EcdsaSighashType::All);

//     println!("\n\nencoded {:?}\n\n", encode(encoded.to_owned()));

//     let payload = sha256(&encoded);

//     println!("hash {:?}\n\n", encode(payload.to_owned()));

//     println!("tx: {:?}", tx);
// }
