import * as ethers from 'ethers';

let wallet = 'test';

export const defaultTx = {
    to: '0x525521d79134822a342d330bd91DA67976569aF1',
    nonce: '1',
    value: '0x038d7ea4c68000',
    maxPriorityFeePerGas: '0x989680', // 0.01 gwei
    maxFeePerGas: '0x8BB2C97000', // 600 gwei
    gasLimit: '21000',
    chainId: '11155111',
};

export const init = (_wallet = 'test') => {
    wallet = _wallet;
};

const domain = {
    name: 'NEAR Trade Signatures',
    version: '1',
    chainId: 11155111,
};

export const msgToTypedData = (msg) => {
    const json = {
        intent: msg,
    };
    const Transaction = [];
    const types = { Transaction };
    Object.entries(json).forEach(([k]) => {
        types.Transaction.push({
            type: 'string',
            name: k,
        });
    });
    return { types, json };
};

export const signMessage = async (msg) => {
    switch (wallet) {
        case 'okx':
            console.log('unsupported');
            break;
        case 'metamask':
            console.log('unsupported');
            break;
        case 'test':
        default:
            // const wallet = ethers.Wallet.createRandom();
            // console.log(wallet.signingKey.privateKey);

            const wallet = new ethers.Wallet(
                '0xb336f6d47fdc061d899467c402cc7659a1052cd10b164a2ae57262d3cf48ffda',
            );

            const { types, json } = msgToTypedData(msg);
            const sig = await wallet.signTypedData(domain, types, json);

            return { address: wallet.address.toLowerCase(), sig };
    }
};
