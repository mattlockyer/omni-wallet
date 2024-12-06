import { contractCall } from './near-provider.js';
import { bitcoinSource, evmSource, evmTarget } from './index.js';
import { relayerUrl } from './env.js';

const source = {
    bitcoin: bitcoinSource,
    evm: evmSource,
};

const target = {
    evm: evmTarget,
};

export const getBalance = async (address) => {
    const balance = await target[globalThis.target].getBalance(address);
    return balance;
};

export const getDerivedAccount = async () => {
    const { address, publicKey } = await source[
        globalThis.source
    ].getDerivedAccount(globalThis.target);
    return { address, publicKey };
};

export const tradeSignature = async ({
    txJson,
    onSignProgress = () => console.log('signature requested'),
    onSignError = (e) => console.error('signature error', e),
    onNearProgress = () => console.log('NEAR contract called'),
    onNearError = (e) => console.error('NEAR contract error', e),
    onTxProgress = () => console.log('transaction broadcasted'),
    onTxError = (e) => console.error('transaction error', e),
    onTxComplete = (res) => console.log('transaction completed', res),
}) => {
    onSignProgress();

    let pk, sig;
    try {
        ({ pk, sig } = await source[globalThis.source].signMessage(txJson));
    } catch (e) {
        return onSignError(e);
    }

    onNearProgress();

    let sigRes;
    try {
        if (relayerUrl) {
            sigRes = await fetch(`${relayerUrl}/trade`, {
                method: 'POST',
                body: JSON.stringify({
                    owner: pk,
                    msg: JSON.stringify(txJson),
                    sig,
                    source: globalThis.source,
                    destination: globalThis.target,
                }),
            }).then((r) => r.json());
        } else {
            // for testing call contract directly from lib
            sigRes = await contractCall({
                methodName: 'trade_signature',
                args: {
                    owner: pk,
                    msg: JSON.stringify(txJson),
                    sig,
                    source: globalThis.source,
                    destination: globalThis.target,
                },
            });
        }
    } catch (e) {
        return onNearError(e);
    }

    onTxProgress();

    let txRes;
    try {
        txRes = await target[globalThis.target].completeTx(txJson, sigRes);
    } catch (e) {
        return onTxError(e);
    }

    // todo call dest chain
    onTxComplete(txRes);
};
