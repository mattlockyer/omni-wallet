import * as ethers from 'ethers';

export const defaultTx = {
    to: '0x525521d79134822a342d330bd91DA67976569aF1',
    nonce: '1',
    value: '0x038d7ea4c68000',
    maxPriorityFeePerGas: '0x989680', // 0.01 gwei
    maxFeePerGas: '0x8BB2C97000', // 600 gwei
    gasLimit: '21000',
    chainId: '11155111',
};

const getSepoliaProvider = () => {
    return new ethers.JsonRpcProvider(
        'https://ethereum-sepolia-rpc.publicnode.com',
    );
};

export const getBalance = async (address) => {
    const rawBalance = await getSepoliaProvider().getBalance(address);
    const balanceInEth = ethers.formatEther(rawBalance);
    return balanceInEth;
};

export const completeTx = async (txJson, sigRes) => {
    console.log('txJson', txJson);
    console.log('sigRes', sigRes);

    const tx = ethers.Transaction.from(txJson);
    const hexPayload = ethers.keccak256(ethers.getBytes(tx.unsignedSerialized));
    const serializedTxHash = Buffer.from(hexPayload.substring(2), 'hex');

    const chainId = parseInt(txJson.chainId, 10);
    const signature = ethers.Signature.from({
        r:
            '0x' +
            Buffer.from(sigRes.big_r.affine_point.substring(2), 'hex').toString(
                'hex',
            ),
        s: '0x' + Buffer.from(sigRes.s.scalar, 'hex').toString('hex'),
        v: sigRes.recovery_id + (chainId * 2 + 35),
    });
    console.log(
        'ethers recoverAddress:',
        ethers.recoverAddress(serializedTxHash, signature),
    );
    tx.signature = signature;
    console.log('tx', tx);
    const serializedTx = tx.serialized;
    console.log('serializedTx', serializedTx);

    let hash;
    try {
        hash = await getSepoliaProvider().send('eth_sendRawTransaction', [
            serializedTx,
        ]);
        console.log('tx hash', hash);
        // console.log('explorer link', `${explorer}/tx/${hash}`);
    } catch (e) {
        if (/nonce too low/gi.test(JSON.stringify(e))) {
            return console.log('tx has been tried');
        }
        if (/gas too low|underpriced/gi.test(JSON.stringify(e))) {
            return console.log(e);
        }
        console.log(e);
    }

    return hash;
};

// Deprecated (for debugging)

// // ECDSA pubKeyRecovered

// let pubKeyRecovered = ec.recoverPubKey(
//     serializedTxHash,
//     {
//         r: Buffer.from(sigRes.big_r.affine_point.substring(2), 'hex'),
//         s: Buffer.from(sigRes.s.scalar, 'hex'),
//     },
//     sigRes.recovery_id,
//     'hex',
// );
// console.log('pubKeyRecovered', pubKeyRecovered.encode('hex'));

// // ECDSA SIG VERIFY

// var ecKey = ec.keyFromPublic(pubKeyRecovered.encode('hex'), 'hex');

// console.log(
//     'verified signature',
//     ecKey.verify(serializedTxHash, {
//         r: Buffer.from(sigRes.big_r.affine_point.substring(2), 'hex'),
//         s: Buffer.from(sigRes.s.scalar, 'hex'),
//     }),
// );

// // end ECDSA verify
