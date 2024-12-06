import { evmTarget } from '../../../dist/index.js';

export const initState = {
    app: {},
    overlay: {},
    transaction: {
        wallet: 'okx',
        json: {
            to: '0x525521d79134822a342d330bd91DA67976569aF1',
            nonce: '5',
            value: '0x038d7ea4c68000',
            maxPriorityFeePerGas: '0x989680', // 0.01 gwei
            maxFeePerGas: '0xA2FB405800', // 600 gwei
            gasLimit: '21000',
            chainId: '11155111',
        },
        derivedAccount: null,
    },
};
