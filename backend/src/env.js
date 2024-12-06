import * as dotenv from 'dotenv';
dotenv.config();

export const {
    REACT_APP_accountId: accountId,
    REACT_APP_secretKey: secretKey,
    REACT_APP_omniContractId: omniContractId,
} = process.env;
