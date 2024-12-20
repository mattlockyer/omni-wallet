import test from 'ava';

import { nearProvider, bitcoinSigner } from '../dist/index.js';
import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
const { contractCall, contractView } = nearProvider;

const msg = 'hello world';

test('lib.bitcoinsigner.signMessage', async (t) => {
    const { pk, sig } = await bitcoinsigner.signMessage(msg);
    t.not(pk, undefined);
    t.not(sig, undefined);
    t.is(pk.length, 64);
    t.is(sig.length, 88);
});

test('contract::verify_owner source: bitcoin', async (t) => {
    const { pk, sig } = await bitcoinsigner.signMessage(msg);

    const res = await contractView({
        methodName: 'verify_owner',
        args: {
            owner: pk,
            msg,
            sig,
            source: 'bitcoin',
        },
    });

    t.is(res, true);
});

test('contract::trade_signature source: bitcoin', async (t) => {
    const { pk, sig } = await bitcoinsigner.signMessage(msg);
    const hash = sha256(Buffer.from(msg)).toString('hex');

    const res = await contractCall({
        methodName: 'trade_signature',
        args: {
            owner: pk,
            msg,
            sig,
            hash,
            source: 'bitcoin',
            destination: 'bitcoin',
        },
    });

    t.not(res, undefined);
    t.not(res.big_r, undefined);
    t.not(res.s, undefined);
    t.not(res.recovery_id, undefined);
});
