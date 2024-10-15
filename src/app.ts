import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';

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

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 60, // 1 hora
    }
}));

app.use('/api/v1', routes);

app.get('/', (_req: Request, _res: Response) => {
    console.log('session app', _req.session);
});

app.use(errorHandler);

export default app;
