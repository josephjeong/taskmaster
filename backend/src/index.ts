import "reflect-metadata";
import "dotenv/config";

import { createUser } from "./users/users-create";
import { createConnection } from "typeorm";

async function whatever() {
  await createConnection();
  const result = await createUser("ab@gmail.com", "a", "a", "a", "a");
  console.log(result);
}

whatever();

/*
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
*/
