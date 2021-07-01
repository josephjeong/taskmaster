import { getConnection } from "typeorm";
import {v4 as uuidv4} from "uuid";

import {Task, Status} from "../entity/Task";

/** function to create and store task in database */
export async function createTask(
    creator : string,
    title : string,
    deadline : Date,
    status : Status,
    project? : string | null,
    description? : string | null,
    estimated_days? : number | null
) : Promise<string> {

    // check values are not empty strings, null/undefined etc.
    if (!(creator && title && deadline && status)) { // && project
        throw "error creating task with given params, ensure they are defined, not empty strings etc.";
    }
    
    // check creator in group/project
    
    // check valid status
    if (!Object.values(Status).includes(status)) {
        throw "invalid task status"
    }
    
    // ensure deadline in the future
    if (deadline.getTime() <= Date.now()) {
        throw "deadline must be in the future"
    }
    
    // ensure estimated_days is positive
    if (estimated_days != null && estimated_days <= 0) {
        throw "estimated_days must be >= 0"
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
