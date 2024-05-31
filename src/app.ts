import express, { Request, Response } from 'express';

import auth from './routes/authenticateRouter';
import { errorHandler } from './middlewares/errorHandler';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', auth);


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});


// app.use((_req: Request, res: Response) => {
//     res.status(404).json({ message: 'Not found' });
// });
app.use(errorHandler);


export default app;