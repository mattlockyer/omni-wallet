import test from 'ava';

import { nearProvider, bitcoin } from '../dist/index.js';
import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
const { getAccount, tradeSignature } = nearProvider;

// tests

// test('account and balance test', async (t) => {
//     const account = getAccount();
//     const balance = await account.getAccountBalance();
//     console.log(balance);
//     t.pass();
// });

// test('sign bitcoin message', async (t) => {
//     bitcoin.signMessage('hello world');
//     t.pass();
// });

// test('tradeSignature bitcoin bitcoin', async (t) => {
//     const msg = 'hello world';
//     const { pk, sig } = bitcoin.signMessage(msg);
//     const hash = sha256(Buffer.from(msg)).toString('hex');

//     let res;
//     try {
//         res = await tradeSignature({
//             owner: pk,
//             msg,
//             sig,
//             hash,
//             source: 'bitcoin',
//             destination: 'bitcoin',
//         });
//     } catch (e) {
//         if (/deserialize/gi.test(JSON.stringify(e))) {
//             return t.fail('Bad arguments to tradeSignature method');
//         }
//         throw e;
//     }

//     console.log(res);

//     t.pass();
// });
