import * as dotenv from 'dotenv';
dotenv.config();

export const {
    REACT_APP_accountId: accountId,
    REACT_APP_secretKey: secretKey,
    REACT_APP_omniContractId: omniContractId,
    REACT_APP_mpcContractId: mpcContractId,
    REACT_APP_relayerUrl: relayerUrl,
} = process.env;

export const runtime = globalThis.runtime;
