import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { getAccount, contractCall } from './near.js';

const app = new Hono();

app.use('/*', cors());

app.get('/', async (c) => {
    return c.text('healthy');
});

app.get('/balance/:id', async (c) => {
    const account = await getAccount(c.req.param('id'));
    const balance = await account.getAccountBalance();
    return c.json(balance);
});

app.post('/trade', async (c) => {
    const args = await c.req.json();

    let sigRes;
    try {
        sigRes = await contractCall({
            methodName: 'trade_signature',
            args,
        });
    } catch (e) {
        return c.error('error trading signature');
    }

    return c.json(sigRes);
});

serve(app, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
});
