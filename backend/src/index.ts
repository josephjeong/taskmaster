import "reflect-metadata";
import "dotenv/config"

import express from 'express';
import { createConnection } from "typeorm";

const PORT = 8080;

// create typeorm connection
createConnection(). then(connection => {

    // start express server 
    const app = express();

    app.post('/login', (req, res) => {
        return res.send('Received a POST /login HTTP method');
      });
      
      app.post('/signup', (req, res) => {
        return res.send('Received a POST /signup HTTP method');
      });
      
      app.listen(PORT, () =>
        // tslint:disable-next-line:no-console
        console.log(`App listening on port ${PORT}!`),
      );
});