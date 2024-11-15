import * as bitcoinMessage from 'bitcoinjs-message';
import ecc from '@bitcoinerlab/secp256k1';
import * as ecpair from 'ecpair';
import { getDerivedAccount as _getDerivedAccount } from './kdf.js';

// prefix used by OKX Wallet and UniSat Wallet
const messagePrefix = '\u0018Bitcoin Signed Message:\n';

export const getDerivedAccount = async (destination) => {
    let address, publicKey;
    switch (globalThis.wallet) {
        case 'okx':
            const res = await window.okxwallet.bitcoin.connect();
            ({ address, publicKey } = await _getDerivedAccount({
                chain: destination,
                path: res.publicKey,
            }));
            return { address, publicKey };
        case 'test':
        default:
            const { ECPairFactory } = ecpair;
            const ECPair = ECPairFactory(ecc);
            const keyPair = ECPair.fromWIF(
                'L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1',
            );
            let pk = keyPair.publicKey as any;
            pk = pk.toString('hex').substring(2);
            ({ address, publicKey } = await _getDerivedAccount({
                chain: destination,
                path: pk,
            }));
            return { address, publicKey };
    }
};

export const signMessage = async (msg) => {
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    let pk, sig;
    switch (globalThis.wallet) {
        case 'okx':
            const res = await window.okxwallet.bitcoin.connect();
            sig = await window.okxwallet.bitcoin.signMessage(msg, 'ecdsa');

            return {
                pk: res.publicKey,
                sig,
            };
        case 'unisat':
            console.log('unsupported');
            break;
        case 'test':
        default:
            const { ECPairFactory } = ecpair;
            const ECPair = ECPairFactory(ecc);
            const keyPair = ECPair.fromWIF(
                'L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1',
            );
            pk = keyPair.publicKey;
            const privateKey = keyPair.privateKey;

            sig = bitcoinMessage.sign(
                msg,
                privateKey,
                keyPair.compressed,
                messagePrefix,
            );

            // DEBUGGING - values for ./contract/bitcoin_owner.rs
            // console.log('publicKey hex', pubkey.toString('hex'));
            // console.log('sig base64', sig.toString('base64'));
            // const { address } = bitcoin.payments.p2pkh({ pubkey });
            // console.log(
            //     'verify signature',
            //     bitcoinMessage.verify(
            //         message,
            //         address,
            //         sig,
            //         messagePrefix,
            //     ),
            // );

            pk = pk.toString('hex').substring(2);
            sig = sig.toString('base64');
    }
    return {
        pk,
        sig,
    };
};
