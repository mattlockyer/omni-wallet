declare global {
    interface Window {
        okxwallet: any;
        unisat: any;
    }
}
// window.okxwallet = window.okxwallet || {};
globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';
globalThis.source = 'bitcoin';
globalThis.destination = 'evm';
globalThis.wallet = 'test';

export const init = (source, destination, wallet) => {
    globalThis.source = source;
    globalThis.destination = destination;
    globalThis.wallet = wallet;
    console.log('TS:', source, destination, wallet);
};

export * as nearProvider from './near-provider.js';
export * as bitcoinSigner from './bitcoin-source.js';
export * as evmSigner from './evm-source.js';
export * as evmTx from './evm-destination.js';

export {
    tradeSignature,
    getDerivedAccount,
    getBalance,
} from './trade-signature.js';
