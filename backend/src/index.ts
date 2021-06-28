import "reflect-metadata";
import "dotenv/config"

import express from 'express';
import { createConnection } from "typeorm";
import { createUser } from "./users/users-create";
import { loginUser } from "./users/users-login";
import { Session } from "./users/users-interface";
import { decodeJWTPayload } from "./users/users-helpers";
import { fetchUserDetails } from "./users/users-details";
import { updateUser } from "./users/users-update";

const PORT = 8080;

// create typeorm connection
createConnection(). then(connection => {

    // start express server 
    const app = express();

    // to pass session between middleware
    let session : Session | null = null;

    app.post('/backend/users/signup', async (req, res) => {
        let token = await createUser(
            req.body.email,
            req.body.password,
            req.body.first_name,
            req.body.last_name,
            req.body.bio
        );

        return res.send({token : token});
      });

    app.post('/backend/users/login', async (req, res) => {
        let token = await loginUser(
            req.body.email,
            req.body.password
        );
    
    return res.send({token: token});
    });
      
    app.all('/backend', async (req, res, next) => {
        session = await decodeJWTPayload(req.header('jwt'));
        
        // check for expired session
        if (session.exp > Date.now()) {
            throw 'Your session has expired. Please log in again.'
        }

        next();
    });

    app.get('backend/users/details', async (req, res) => {
        return res.send(await fetchUserDetails(req.body.id));
    });

    app.post('backend/users/update', async (req, res) => {
        await updateUser(req.body.id, req.body.changes);
        return res.send('updated succesfully!')
    }) 
      
      app.listen(PORT, () =>
        // tslint:disable-next-line:no-console
        console.log(`App listening on port ${PORT}!`),
      );
});