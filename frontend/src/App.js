import { useEffect } from 'react';
import { wrap } from './state/state';
import { bitcoin } from '../../dist/index.js';
import './styles/app.scss';

const AppComp = ({ state, update }) => {
    const { transaction } = state;

    console.log(transaction);

    useEffect(() => {
        (async () => {
            const { pk, sig } = await bitcoin.signMessage('hello world');
            console.log(pk, sig);
        })();
    }, []);

    return (
        <>
            <h4>Transaction</h4>
            <textarea
                rows={12}
                cols={64}
                defaultValue={JSON.stringify(transaction.json, null, 4)}
            ></textarea>
            <br />
            <button
                onClick={async () => {
                    bitcoin.init('okx');
                    // const { pk, sig } =
                    //     await bitcoin.signMessage('hello world');
                    // console.log(pk, sig);
                    const res = await bitcoin.tradeSignature(
                        JSON.stringify(transaction.json),
                        'evm',
                    );
                }}
            >
                Sign with OKX Wallet
            </button>
        </>
    );
};

export const App = wrap(AppComp, ['app', 'transaction']);
