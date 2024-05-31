import express, { Request, Response } from 'express';

import auth from './routes/authenticateRouter';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', auth);


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});



export default app;