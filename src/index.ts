declare global {
    interface Window {
        okxwallet: any;
        unisat: any;
    }
}
// window.okxwallet = window.okxwallet || {};
globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';
globalThis.source = 'bitcoin';
globalThis.target = 'evm';
globalThis.wallet = 'test';

export const init = (source, destination, wallet) => {
    globalThis.source = source;
    globalThis.destination = destination;
    globalThis.wallet = wallet;
};

export * as nearProvider from './near-provider.js';
export * as bitcoinSource from './bitcoin-source.js';
export * as evmSource from './evm-source.js';
export * as evmTarget from './evm-target.js';

export {
    tradeSignature,
    getDerivedAccount,
    getBalance,
} from './trade-signature.js';
