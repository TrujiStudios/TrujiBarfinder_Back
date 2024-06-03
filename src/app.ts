import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/errorHandler';

import routes from './routes';

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', routes);


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});


// app.use((_req: Request, res: Response) => {
//     res.status(404).json({ message: 'Not found' });
// });
app.use(errorHandler);


export default app;