import * as nearAPI from 'near-api-js';
const { Near, Account, KeyPair, keyStores } = nearAPI;
import { accountId, secretKey, contractId } from './env.js';

const getTxTimeout = 20000;
const networkId = 'testnet';
const gas = BigInt('300000000000000');
const keyPair = KeyPair.fromString(secretKey);
const keyStore = new keyStores.InMemoryKeyStore();
keyStore.setKey(networkId, accountId, keyPair);
const config = {
    networkId,
    keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    // nodeUrl: 'https://test.rpc.fastnear.com',
    walletUrl: 'https://testnet.mynearwallet.com/',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://testnet.nearblocks.io',
};
const near = new Near(config);
const { connection } = near;
const { provider } = connection;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const getAccount = (id = accountId) => new Account(connection, id);

export const contractView = async (methodName, args) => {
    const account = getAccount();
    let res;
    try {
        res = await account.viewFunction({
            contractId,
            methodName,
            args,
            gas,
        });
    } catch (e) {
        if (/deserialize/gi.test(JSON.stringify(e))) {
            console.log(`Bad arguments to ${methodName} method`);
        }
        throw e;
    }
    return res;
};

export const contractCall = async (methodName, args) => {
    const account = getAccount();
    let res;
    try {
        res = await account.functionCall({
            contractId,
            methodName,
            args,
            gas,
        });
    } catch (e) {
        if (/deserialize/gi.test(JSON.stringify(e))) {
            return console.log(`Bad arguments to ${methodName} method`);
        }
        if (e.context.transactionHash) {
            console.log(
                `Transaction timeout for hash ${e.context.transactionHash} will attempt to get tx result in 20s`,
            );
            await sleep(getTxTimeout);
            return getTxSuccessValue(e.context.transactionHash);
        }
        throw e;
    }

    return parseSuccessValue(res);
};

export const getTxResult = async (txHash) => {
    const transaction = await provider.txStatus(txHash, 'unnused');
    return transaction;
};

export const getTxSuccessValue = async (txHash) => {
    const transaction = await getTxResult(txHash);
    return parseSuccessValue;
};

export const parseSuccessValue = async (transaction) => {
    try {
        return JSON.parse(
            Buffer.from(transaction.status.SuccessValue, 'base64').toString(
                'ascii',
            ),
        );
    } catch (e) {
        console.log(
            `Error parsing success value for transaction ${JSON.stringify(transaction)}`,
        );
    }
};
