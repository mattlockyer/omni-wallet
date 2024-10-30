import test from 'ava';

import { nearProvider } from '../dist/index.js';
const { getAccount, getTxResult } = nearProvider;

test('lib.nearProvider.getAccount', async (t) => {
    const account = getAccount();
    const balance = await account.getAccountBalance();

    // TODO test balance gt some minimum

    t.not(balance.total, undefined);
});

test('lib.nearProvider.getTxResult', async (t) => {
    const res = await getTxResult(
        'GhFx8HjBjU7uBkaK5U8T3sFCQEPS1zoEGfKe1gRaac3Z',
    );
    console.log('res.status.SuccessValue', res.status.SuccessValue);
    t.pass();
});
