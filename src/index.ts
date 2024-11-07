declare global {
    interface Window {
        okxwallet: any;
    }
}
// window.okxwallet = window.okxwallet || {};
globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';

export * as nearProvider from './near-provider.js';
export * as bitcoin from './bitcoin.js';
export * as evm from './evm.js';
export { generateAddress } from './kdf.js';
