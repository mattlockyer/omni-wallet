import { contractCall } from './near-provider.js';
import { bitcoinSource } from './index.js';
import { evmSource } from './index.js';
import { evmTarget } from './index.js';

const source = {
    bitcoin: bitcoinSource,
    evm: evmSource,
};

const destination = {
    evm: evmTarget,
};

export const getBalance = async (address) => {
    const balance =
        await destination[globalThis.destination].getBalance(address);
    return balance;
};

export const getDerivedAccount = async () => {
    const { address, publicKey } = await source[
        globalThis.source
    ].getDerivedAccount(globalThis.destination);
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
        sigRes = await contractCall({
            methodName: 'trade_signature',
            args: {
                owner: pk,
                msg: JSON.stringify(txJson),
                sig,
                source: globalThis.source,
                destination: globalThis.destination,
            },
        });
    } catch (e) {
        return onNearError(e);
    }

    onTxProgress();

    let txRes;
    try {
        txRes = await destination[globalThis.destination].completeTx(
            txJson,
            sigRes,
        );
    } catch (e) {
        return onTxError(e);
    }

    // todo call dest chain
    onTxComplete(txRes);
};
