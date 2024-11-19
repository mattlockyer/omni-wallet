declare global {
    interface Window {
        okxwallet: any;
        unisat: any;
    }
}
// window.okxwallet = window.okxwallet || {};
globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';
globalThis.wallet = 'test';

export const initWallet = (wallet) => {
    globalThis.wallet = wallet;
    console.log('TS: wallet', wallet);
};

export * as nearProvider from './near-provider.js';
export * as bitcoinSigner from './bitcoin-signer.js';
export * as evmSigner from './evm-signer.js';
export * as evmTx from './evm-tx.js';

export { tradeSignature, getDerivedAccount } from './trade-signature.js';
