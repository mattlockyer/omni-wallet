import { evmTarget } from '../../../dist/index.js';

export const initState = {
    app: {},
    overlay: {},
    transaction: {
        wallet: 'okx',
        json: evmTarget.defaultTx,
        derivedAccount: null,
    },
};
