import test from 'ava';

import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
import { nearProvider, evmSigner } from '../dist/index.js';
const { contractView, contractCall } = nearProvider;

const msg = 'hello world';

test('lib.evmsigner.signMessage', async (t) => {
    const msg = 'hello world';
    const { address, sig } = await evmsigner.signMessage(msg);

    t.not(address, undefined);
    t.not(sig, undefined);
    t.is(address.length, 42);
    t.is(sig.length, 132);
});

test('contract::verify_owner source: evm', async (t) => {
    const { address, sig } = await evmsigner.signMessage(msg);

    const res = await contractView({
        methodName: 'verify_owner',
        args: {
            owner: address,
            msg,
            sig,
            source: 'evm',
        },
    });

    t.is(res, true);
});

test('contract::trade_signature source: evm', async (t) => {
    const { address, sig } = await evmsigner.signMessage(msg);
    const hash = sha256(Buffer.from(msg)).toString('hex');

    const res = await contractCall({
        methodName: 'trade_signature',
        args: {
            owner: address,
            msg,
            sig,
            hash,
            source: 'evm',
            destination: 'bitcoin',
        },
    });

    t.not(res, undefined);
    t.not(res.big_r, undefined);
    t.not(res.s, undefined);
    t.not(res.recovery_id, undefined);
});
