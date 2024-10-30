import * as bitcoin from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import * as ecc from 'tiny-secp256k1';
import * as ecpair from 'ecpair';

// prefix used by OKX Wallet and UniSat Wallet
const messagePrefix = '\u0018Bitcoin Signed Message:\n';

let wallet = 'test';

export const init = (_wallet = 'test') => {
    wallet = _wallet;
};

export const signMessage = async (msg) => {
    switch (wallet) {
        case 'okx':
            console.log('unsupported');
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
            const pk = keyPair.publicKey;
            const privateKey = keyPair.privateKey;

            const sig = bitcoinMessage.sign(
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

            return {
                pk: pk.toString('hex').substring(2),
                sig: sig.toString('base64'),
            };
    }
};
