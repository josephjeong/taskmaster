import "reflect-metadata";
import "dotenv/config";

import express from "express";
import { createConnection } from "typeorm";
import { createUser } from "./users/users-create";
import { loginUser } from "./users/users-login";
import { decodeJWTPayload } from "./users/users-helpers";
import { fetchUserDetails } from "./users/users-details";
import { updateUser } from "./users/users-update";
import { createTask } from "./tasks/task-create";
import { editTask } from "./tasks/task-edit";
import { getProfileTasks } from "./tasks/get-profile-tasks";
import cors from "cors";
import { User } from "./entity/User";
import { Task } from "./entity/Task";
import { Connection } from "./entity/Connection";

const PORT = 8080;

// create typeorm connection
createConnection({
  entities: [User, Task, Connection],
  type: "postgres",
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number(process.env.TYPEORM_PORT),
  host: process.env.TYPEORM_HOST,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
  logging: true,
})
  .then((connection) => {
    // start express server
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.post("/users/signup", async (req, res) => {
      const token = await createUser(
        req.body.email,
        req.body.password,
        req.body.first_name,
        req.body.last_name,
        req.body.bio
      );

      return res.send({ token: token });
    });

    app.post("/users/login", async (req, res) => {
      const token = await loginUser(req.body.email, req.body.password);

      return res.send({ token: token });
    });

    app.get("/users/details/:id", async (req, res) => {
      const details = await fetchUserDetails(req.params.id);
      const tasks = await getProfileTasks(res.locals.sessions.id, req.params.id);
      details.tasks = tasks;
      return res.send(details);
      
    });

    app.use(async (req, res, next) => {
      res.locals.session = await decodeJWTPayload(req.header("jwt"));
      next();
    });

    app.get("/users/me", async (req, res) => {
      const tasks = await getProfileTasks(res.locals.sessions.id, res.locals.session.id);
      let details = await fetchUserDetails(res.locals.session.id);
      console.log(details);
      details.tasks = tasks;
      return res.send(details);
    });

    app.post("/users/update", async (req, res) => {
      await updateUser(res.locals.session.id, req.body.changes);
      return res.send("updated successfully!");
    });
     
    app.get("/tasks", async (req, res) => {
      return res.send(await getProfileTasks(res.locals.session.id, res.locals.session.id));
    });
    
    app.post("/tasks/create", async (req, res) => {
      await createTask(res.locals.session.id,
        req.body.title,
        req.body.deadline,
        req.body.status,
        req.body.project, // can be null
        req.body.description, // can be null
        req.body.estimated_days // can be null
      );
      return res.send("create task success");
    });
    
    app.post("/tasks/edit", async (req, res) => {
      await editTask(req.body.task_id,
        res.locals.session.id,
        // must specify at least one of the following
        req.body.title,
        req.body.deadline,
        req.body.status,
        req.body.description,
        req.body.estimated_days
      );
      return res.send("edit task success");
    });

    app.listen(PORT, () =>
      // tslint:disable-next-line:no-console
      console.log(`App listening on port ${PORT}!`)
    );
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
  });
