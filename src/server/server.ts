import app from '../app';
import db from '../config/database';
import { environment } from '../config/environment';


const startServer = () => {

    db.then(() => {
        console.log('Connected to the database');
    }).catch((error) => {
        console.error('Error connecting to the database', error);
    });

    app.listen(environment.port, () => {
        console.log(`Server is running on  http://localhost:${environment.port}`);
    });
};


startServer();