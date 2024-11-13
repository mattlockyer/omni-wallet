import { contractCall } from './near-provider.js';
import { bitcoinSigner } from './index.js';
import { evmSigner } from './index.js';
import { evmTx } from './index.js';

const signers = {
    bitcoin: bitcoinSigner,
    evm: evmSigner,
};

const tx = {
    evm: evmTx,
};

export const tradeSignature = async ({
    txJson,
    source,
    destination,
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
        ({ pk, sig } = await signers[source].signMessage(txJson));
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
                source,
                destination,
            },
        });
    } catch (e) {
        return onNearError(e);
    }

    onTxProgress();

    let txRes;
    try {
        txRes = await tx[destination].completeTx(txJson, sigRes);
    } catch (e) {
        return onTxError(e);
    }

    // todo call dest chain
    onTxComplete(txRes);
};
