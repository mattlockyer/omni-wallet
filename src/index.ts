globalThis.runtime = typeof window === 'undefined' ? 'node' : 'browser';

export * as bitcoin from './bitcoin.js';
export * as nearProvider from './near-provider.js';
