import { evmTx } from '../../../dist/index.js';

export const initState = {
    app: {},
    overlay: {},
    transaction: {
        json: evmTx.defaultTx,
        derivedAccount: null,
    },
};
