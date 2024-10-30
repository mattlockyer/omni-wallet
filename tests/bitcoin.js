import test from 'ava';

import { nearProvider, bitcoin } from '../dist/index.js';
import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
const { getAccount, contractCall, contractView, getTxResult } = nearProvider;

// tests

test('library.nearProvider.getAccount', async (t) => {
    const account = getAccount();
    const balance = await account.getAccountBalance();

    // TODO test balance

    t.not(balance.total, undefined);
});

test('lib.nearProvider.getTxResult', async (t) => {
    const res = await getTxResult(
        'GhFx8HjBjU7uBkaK5U8T3sFCQEPS1zoEGfKe1gRaac3Z',
    );
    console.log('res.status.SuccessValue', res.status.SuccessValue);
    t.pass();
});

test('library.bitcoin.signMessage', async (t) => {
    const { pk, sig } = await bitcoin.signMessage('hello world');
    console.log(pk, sig);
    t.not(pk, undefined);
    t.not(sig, undefined);
    t.is(pk.length, 64);
    t.is(sig.length, 88);
});

test('contract::verify_owner source: bitcoin', async (t) => {
    const msg = 'hello world!';
    const { pk, sig } = await bitcoin.signMessage(msg);

    const res = await contractView('verify_owner', {
        owner: pk,
        msg,
        sig,
        source: 'bitcoin',
    });

    t.is(res, true);
});

test('contract::trade_signature source: bitcoin', async (t) => {
    const msg = 'hello world!!!';
    const { pk, sig } = await bitcoin.signMessage(msg);
    const hash = sha256(Buffer.from(msg)).toString('hex');

    const res = await contractCall('trade_signature', {
        owner: pk,
        msg,
        sig,
        hash,
        source: 'bitcoin',
        destination: 'bitcoin',
    });

    console.log(res);

    t.pass();
});
