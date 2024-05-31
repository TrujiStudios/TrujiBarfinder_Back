import app from '../app';



const port = 3000;


// app.listen(port, () => {
//     console.log(`Compañia  "TrujiStudios"`);
//     console.log(`Server is running on  http://localhost:${port}`);
// });


const startServer = () => {

    app.listen(port, () => {
        console.log(`Server is running on  http://localhost:${port}`);
    });
};


startServer();