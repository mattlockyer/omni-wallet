import * as bitcoin from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import ecc from '@bitcoinerlab/secp256k1';
import * as ecpair from 'ecpair';
import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
import { contractCall } from './near-provider.js';

// prefix used by OKX Wallet and UniSat Wallet
const messagePrefix = '\u0018Bitcoin Signed Message:\n';

let wallet = 'test';

export const init = (_wallet = 'test') => {
    wallet = _wallet;
};

export const signMessage = async (msg) => {
    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    let pk, sig;
    switch (wallet) {
        case 'okx':
            const res = await window.okxwallet.bitcoin.connect();
            sig = await window.okxwallet.bitcoin.signMessage(msg, 'ecdsa');

            return {
                pk: res.publicKey,
                sig,
            };
            break;
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

export const tradeSignature = async (msg, destination) => {
    const { pk, sig } = await signMessage(msg);
    const hash = sha256(Buffer.from(msg)).toString('hex');

    const res = await contractCall({
        methodName: 'trade_signature',
        args: {
            owner: pk,
            msg,
            sig,
            hash,
            source: 'bitcoin',
            destination,
        },
    });

    console.log(res);
};
