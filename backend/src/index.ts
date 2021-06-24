import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));

import express from 'express';

const PORT = 8080;

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
