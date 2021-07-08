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
import { acceptRequest, createUserConnection, declineRequest, isConnected, getIncomingConnectionRequests, getOutgoingConnectionRequests } from "./connection";


const PORT = 8080;

// start express server
// initiated outside of connection to export it
const app = express();

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
      return res.send(details);
    });

    app.use(async (req, res, next) => {
      res.locals.session = await decodeJWTPayload(req.header("jwt"));
      next();
    });

    app.get("/users/me", async (req, res) => {
      const details = await fetchUserDetails(res.locals.session.id);
      return res.send(details);
    });

    app.post("/users/update", async (req, res) => {
      await updateUser(res.locals.session.id, req.body.changes);
      return res.send("updated successfully!");
    });
     
    app.get("/tasks", async (req, res) => {
      return res.send(await getProfileTasks(res.locals.session.id, res.locals.session.id));
    });
    
    app.get("/users/tasks/:id", async (req, res) => {
      const tasks = await getProfileTasks(res.locals.sessions.id, req.params.id);
      return res.send(tasks);
    });
    
    app.post("/tasks/create", async (req, res) => {
      const deadlineTime = new Date(req.body.deadline);
      await createTask(res.locals.session.id,
        req.body.title,
        deadlineTime,
        req.body.status,
        req.body.project, // can be null
        req.body.description, // can be null
        req.body.estimated_days // can be null
      );
      return res.send("create task success");
    });
    
    app.post("/tasks/edit", async (req, res) => {
      let deadlineTime = null;
      if (req.body.deadline) {
        deadlineTime = new Date(req.body.deadline);
      }
      await editTask(req.body.task_id,
        res.locals.session.id,
        // must specify at least one of the following
        req.body.title,
        deadlineTime,
        req.body.status,
        req.body.description,
        req.body.estimated_days
      );
      return res.send("edit task success");
    });

    app.post("/connection/create", async (req, res) => {
      await createUserConnection(res.locals.session.id, req.body.id);
      return res.send("updated succesfully!");
    });

    app.post("/connection/accept", async (req, res) => {
      await acceptRequest(res.locals.session.id, req.body.id);
      return res.send("updated succesfully!");
    });

    app.post("/connection/decline", async (req, res) => {
      await declineRequest(res.locals.session.id, req.body.id);
      return res.send("updated succesfully!");
    });

    app.get("/connection/status/:userId", async (req, res) => {
      const s = await isConnected(res.locals.session.id, req.params.userId);
      return res.send(s);
    });

    app.get("/connection/incomingRequests", async (req, res) => {
      const s = await getIncomingConnectionRequests(req.params.userId);
      return res.send(s);
    });


    app.get("/connection/incomingRequests", async (req, res) => {
      const s = await getOutgoingConnectionRequests(req.params.userId);
      return res.send(s);
    });


    app.listen(PORT, () =>
      // tslint:disable-next-line:no-console
      console.log(`App listening on port ${PORT}!`)
    );
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
  });

  export default app;