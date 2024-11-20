import * as bitcoinMessage from 'bitcoinjs-message';
import ecc from '@bitcoinerlab/secp256k1';
import * as ecpair from 'ecpair';
import { getDerivedAccount as _getDerivedAccount } from './kdf.js';

// prefix used by OKX Wallet and UniSat Wallet
const messagePrefix = '\u0018Bitcoin Signed Message:\n';

export const getDerivedAccount = async (destination) => {
    let path;
    switch (globalThis.wallet) {
        case 'okx':
            if (typeof window.okxwallet === 'undefined') {
                new Error('OKX Wallet is installed!');
            }
            const res = await window.okxwallet.bitcoin.connect();
            path = res.publicKey;
            break;
        case 'unisat':
            if (typeof window.unisat === 'undefined') {
                new Error('UniSat Wallet is installed!');
            }
            await window.unisat.requestAccounts();
            path = await window.unisat.getPublicKey();
            path = path.substring(2);
            break;
        case 'test':
        default:
            const { ECPairFactory } = ecpair;
            const ECPair = ECPairFactory(ecc);
            const keyPair = ECPair.fromWIF(
                'L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1',
            );
            path = keyPair.publicKey as any;
            path = path.toString('hex').substring(2);
    }

    return _getDerivedAccount({
        chain: destination,
        path,
    });
};

export const signMessage = async (msg) => {
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    let pk, sig;
    switch (globalThis.wallet) {
        case 'okx':
            if (typeof window.okxwallet === 'undefined') {
                new Error('OKX Wallet is installed!');
            }
            const res = await window.okxwallet.bitcoin.connect();
            pk = res.publicKey;
            sig = await window.okxwallet.bitcoin.signMessage(msg, 'ecdsa');
        case 'unisat':
            if (typeof window.unisat === 'undefined') {
                new Error('UniSat Wallet is installed!');
            }
            await window.unisat.requestAccounts();
            pk = await window.unisat.getPublicKey();
            pk = pk.substring(2);
            sig = await window.unisat.signMessage(msg, 'ecdsa');
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
