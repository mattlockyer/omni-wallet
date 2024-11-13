import { evmTx } from '../../../dist/index.js';

export const initState = {
    app: {},
    overlay: {},
    transaction: {
        json: evmTx.defaultTx,
    },
    bitcoin: {
        step: 'connect',
    },
    evm: {
        step: 'connect',
    },
};
