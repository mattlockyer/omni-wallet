import { wrap } from './state/state';
import {
    init,
    evmTarget,
    tradeSignature,
    getDerivedAccount,
    getBalance,
} from '../../dist/index.js';
import { Overlay } from './components/Overlay.js';
import './styles/app.scss';
import { useEffect } from 'react';

const AppComp = ({ state, update }) => {
    const { transaction } = state;
    const { wallet, derivedAccount, balance } = transaction;

    const updateOverlay = (msg) => update({ msg }, 'overlay');

    const updateWallet = async (wallet) => {
        update({ derivedAccount: null }, 'transaction');
        init('bitcoin', 'evm', wallet);
        const derivedAccount = await getDerivedAccount();
        const balance = await getBalance(derivedAccount.address);
        update({ wallet, derivedAccount, balance }, 'transaction');
    };

    useEffect(() => {
        if (!derivedAccount) {
            updateWallet(wallet);
        }
    }, []);

    return (
        <>
            <Overlay />
            <div className="container-fluid">
                <section>
                    <h4>Transaction</h4>
                    <textarea
                        className="textarea"
                        rows={10}
                        cols={56}
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
                </section>

                <section>
                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            update(
                                { json: evmTarget.defaultTx },
                                'transaction',
                            );
                        }}
                    >
                        EVM TX
                    </button>
                </section>

                <section className="btn-group">
                    <button
                        className={`btn btn-${wallet !== 'okx' ? 'outline-' : ''}primary`}
                        onClick={() => updateWallet('okx')}
                    >
                        OKX Wallet
                    </button>
                    <button
                        className={`btn btn-${wallet !== 'unisat' ? 'outline-' : ''}primary`}
                        onClick={() => updateWallet('unisat')}
                    >
                        UniSat Wallet
                    </button>
                </section>

                {derivedAccount && (
                    <>
                        <section>
                            <h4>Derived Account</h4>
                            <p>{derivedAccount.address}</p>
                            <h4>
                                Balance: {balance}{' '}
                                <button
                                    className="btn btn-primary btn-circle"
                                    onClick={() => updateWallet(wallet)}
                                >
                                    ⟳
                                </button>
                            </h4>
                        </section>
                        <section>
                            <button
                                className="btn btn-primary"
                                onClick={async () => {
                                    const res = await tradeSignature({
                                        txJson: transaction.json,
                                        onSignProgress: () =>
                                            updateOverlay(
                                                'Please sign TX in wallet.',
                                            ),
                                        onSignProgress: () =>
                                            updateOverlay(
                                                'Awaiting signature.',
                                            ),
                                        onTxProgress: () =>
                                            updateOverlay(
                                                'Transaction broadcasted.',
                                            ),
                                        onTxComplete: (hash) =>
                                            updateOverlay(
                                                <a
                                                    href={`${evmTarget.explorer}/tx/${hash}`}
                                                    target="_blank"
                                                >
                                                    Explorer Link
                                                </a>,
                                            ),
                                    });

                                    console.log(res);
                                }}
                            >
                                Sign TX
                            </button>
                        </section>
                        <section>
                            <button
                                className="btn btn-primary"
                                onClick={() => updateOverlay('test')}
                            >
                                Test
                            </button>
                        </section>
                    </>
                )}
            </div>
        </>
    );
};

export const App = wrap(AppComp, ['app', 'overlay', 'transaction']);
