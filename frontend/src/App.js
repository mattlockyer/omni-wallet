import { wrap } from './state/state';
import {
    initWallet,
    evmTx,
    tradeSignature,
    getDerivedAccount,
} from '../../dist/index.js';
import './styles/app.scss';
import { useEffect } from 'react';

const AppComp = ({ state, update }) => {
    const { transaction } = state;

    useEffect(() => {
        (async () => {
            if (!transaction.derivedAccount) {
                // initWallet('okx');
                // let derivedAccount = await getDerivedAccount({
                //     source: 'bitcoin',
                //     destination: 'evm',
                // });
                // console.log(derivedAccount);
                initWallet('unisat');
                derivedAccount = await getDerivedAccount({
                    source: 'bitcoin',
                    destination: 'evm',
                });
                console.log(derivedAccount);
                update({ derivedAccount }, 'transaction');
            }
        })();
    }, []);

    return (
        <>
            <h4>Transaction</h4>
            <button
                onClick={async () => {
                    update({ json: evmTx.defaultTx }, 'transaction');
                }}
            >
                EVM TX
            </button>
            <br />
            <br />

            <textarea
                rows={12}
                cols={64}
                value={JSON.stringify(transaction.json, null, 4)}
                onChange={({ target: { value } }) => {
                    let json;
                    try {
                        json = JSON.parse(value);
                    } catch (e) {
                        json = {
                            message:
                                'Bad JSON, resetting in 2s. Please try again.',
                        };
                        setTimeout(
                            () =>
                                update(
                                    { json: transaction.json },
                                    'transaction',
                                ),
                            2000,
                        );
                    }
                    update({ json }, 'transaction');
                }}
            ></textarea>
            <br />
            <button
                onClick={async () => {
                    // const { pk, sig } =
                    //     await bitcoin.signMessage('hello world');
                    // console.log(pk, sig);
                    const res = await tradeSignature({
                        source: 'bitcoin',
                        destination: 'evm',
                        txJson: transaction.json,
                    });

                    console.log(res);
                }}
            >
                Sign with OKX Bitcoin Wallet
            </button>
        </>
    );
};

export const App = wrap(AppComp, ['app', 'transaction']);
