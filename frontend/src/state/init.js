import { evm, bitcoin } from '../../../dist/index.js';

export const initState = {
    app: {},
    overlay: {},
    transaction: {
        json: evm.defaultTx,
    },
    bitcoin: {
        step: 'connect',
    },
    evm: {
        step: 'connect',
    },
};
