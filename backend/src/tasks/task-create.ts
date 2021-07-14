import { getConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Task, Status } from "../entity/Task";
import { TaskAssignment } from "../entity/TaskAssignment";
import { isConnected } from "../connection";
import { validAssignees } from "./task-helpers"

/** function to create and store task in database */
export async function createTask(
    creator : string,
    title : string,
    deadline : Date,
    status : Status,
    assignees : string[], // change to null
    project? : string | null,
    description? : string | null,
    estimated_days? : number | null
) : Promise<string> {

    // check values are not empty strings, null/undefined etc.
    if (!(creator && title && deadline && status)) {
        throw "error creating task with given params, ensure they are defined, not empty strings etc.";
    }

    // check either assignee or group_assignee is not null
    if ((!assignees || assignees.length == 0)) {// && !group_assignee, change to either group or assignees
        throw "either assignees or group_assignee has to be not null or empty"
    }
    
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
    
    // if (!assignees && group_assignee && check creator and assignees in group/project) {
    //     set group assignee
    // }
    
    // save assignment in database if specified, 
    // change validAssignees to check same group/project as well
    if (assignees && (await validAssignees(creator, assignees))) {
        for (const assignee of assignees) {
            const assignment = new TaskAssignment();
            assignment.id = uuidv4();
            assignment.task = task.id;
            assignment.user_assignee = assignee;
            // set assignment.group_assignee if specified
            await getConnection().manager.save(assignment);
        }
    } else {
        throw "invalid assignees, they must be connected or in same group";
    }

    // return task id
    return task.id;
}
