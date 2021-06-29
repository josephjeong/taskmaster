import { getConnection } from "typeorm";
import {v4 as uuidv4} from "uuid";

import {Task, Status} from "../entity/Task";

/* function to create and store task in database */
export async function createTask(
    creator : string,
    title : string,
    deadline : Date,
    status : Status,
    project? : string | null,
    description? : string | null,
    estimated_days? : number | null
) : Promise<string> {

    // check user in group/project
    
    // maybe check for duplicate task title or overlap?
    
    // check values are not empty strings, null/undefined etc.
    if (!(creator && title && deadline && status)) { // && project
        throw "error creating task with given params, ensure they are defined, not empty strings etc.";
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

    // return task id
    return task.id;
}