import express, { Request, Response } from 'express';
import cors from 'cors';
import cookie from "cookie-parser";

import { errorHandler } from './middlewares/errorHandler';

import routes from './routes';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookie());

app.use('/api/v1', routes);


app.get('/', (_req: Request, res: Response) => {
    res.send('Hello, World!');
});


// app.use((_req: Request, res: Response) => {
//     res.status(404).json({ message: 'Not found' });
// });
app.use(errorHandler);


export default app;