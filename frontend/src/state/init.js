import { evmTx } from '../../../dist/index.js';

export const initState = {
    app: {},
    overlay: {},
    transaction: {
        wallet: 'okx',
        json: evmTx.defaultTx,
        derivedAccount: null,
    },
};
