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
        // expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
        // maxAge: 5000,
        maxAge: 1000 * 60 * 60, // 1 hora

    }  //esto debería ser true en producción y false en desarrollo para que funcione con http://localhost:5173
}));

// declare module 'express-session' {
//     interface SessionData {
//         user: string;
//     }
// }

app.use('/api/v1', routes);



app.get('/', (_req: Request, _res: Response) => {
    // _req.session.visitas = _req.session.visitas ? _req.session.visitas + 1 : 1;
    console.log('session app', _req.session);
});

app.use(errorHandler);


export default app;