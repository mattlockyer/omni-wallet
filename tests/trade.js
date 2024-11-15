import test from 'ava';

import { initWallet, getDerivedAccount } from '../dist/index.js';

test('lib.getDerivedAccount', async (t) => {
    initWallet('test');
    const { address, publicKey } = await getDerivedAccount({
        source: 'bitcoin',
        destination: 'evm',
    });
    t.not(address, undefined);
    t.not(publicKey, undefined);
    t.is(address.length, 42);
    t.is(publicKey.length, 130);
});
