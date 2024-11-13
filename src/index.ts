declare global {
    interface Window {
        okxwallet: any;
    }
}
// window.okxwallet = window.okxwallet || {};
globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';
globalThis.wallet = 'test';

export const initWallet = (wallet) => {
    globalThis.wallet = wallet;
};

export * as nearProvider from './near-provider.js';
export * as bitcoinSigner from './bitcoin-signer.js';
export * as evmSigner from './evm-signer.js';
export * as evmTx from './evm-tx.js';

export { tradeSignature } from './trade-signature.js';
export { generateAddress } from './kdf.js';
