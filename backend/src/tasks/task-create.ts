import { getConnection } from "typeorm";
import {v4 as uuidv4} from "uuid";

import {Task, Status} from "../entity/Task";

/* function to create and store task in database */
export async function createTask(
    project : string,
    creator : string,
    title : string,
    deadline : Date,
    status : Status,
    // jwt : string,
    description? : string,
    estimated_days? : number
) : Promise<void> {

    // todo: authenticate jwt?

    // maybe check for duplicate task title or overlap?
    
    // check values are not empty strings, null/undefined etc.
    if (!(project && creator && title && deadline && status)) { // && jwt
        throw "error creating task with given params, ensure they are all defined";
    }

    // new task
    const task = new Task();
    task.project = project;
    task.creator = creator;
    task.title = title;
    task.deadline = deadline;
    task.status = status;
    task.description = description;
    task.estimated_days = estimated_days;

    // task id as uuid
    task.id = uuidv4();

    // save task
    await getConnection().manager.save(task);

    return;
}
