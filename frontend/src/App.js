import { wrap } from './state/state';
import { nearProvider } from '../../dist/index.js';
import './styles/app.scss';

const AppComp = ({ state, update }) => {
    const { source, destination } = state;

    console.log(nearProvider);

    return <h1>Hello</h1>;
};

export const App = wrap(AppComp, ['app']);
