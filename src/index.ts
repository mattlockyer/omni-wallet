globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';

export * as nearProvider from './near-provider.js';
export * as bitcoin from './bitcoin.js';
export * as evm from './evm.js';
