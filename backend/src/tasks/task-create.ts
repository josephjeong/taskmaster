import { getConnection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Task, Status } from "../entity/Task";
import { TaskAssignment } from "../entity/TaskAssignment";
import { validAssignees, userIdExists } from "./task-helpers";
import { ApiError } from "../errors";

/** function to create and store task in database */
export async function createTask(
    creator : string,
    title : string,
    deadline : Date,
    status : Status,
    assignees? : string[] | null,
    project? : string | null,
    description? : string | null,
    estimated_days? : number | null
) : Promise<string> {

    // check values are not empty strings, null/undefined etc.
    if (!creator)
        throw new ApiError("createTask/invalid_creator", "creator is null/undefined or empty string");
    
    if (!(title && title.trim().length > 0))
        throw new ApiError("createTask/invalid_title", "title is null/undefined or empty string");
    
    if (!deadline || !(deadline instanceof Date))
        throw new ApiError("createTask/invalid_deadline", "deadline is not a Date, or is null/undefined");
    
    // ensure deadline in the future
    if (deadline.getTime() <= Date.now())
        throw new ApiError("createTask/invalid_deadline", "deadline must be in the future");
    
    if (!status)
        throw new ApiError("createTask/invalid_status", "status is null/undefined or empty string");
    
    // check valid status
    if (!Object.values(Status).includes(status))
        throw new ApiError("createTask/invalid_status", 'Status enum is {NOT_STARTED = "TO_DO", IN_PROGRESS = "IN_PROGRESS", BLOCKED = "BLOCKED", COMPLETED = "DONE"}');
    
    // ensure estimated_days is positive
    if (estimated_days !== null && estimated_days !== undefined && estimated_days < 0)
        throw new ApiError("createTask/invalid_estimated_days", "estimated_days must be >= 0");
    
    if (!(await userIdExists(creator)))
        throw new ApiError("createTask/invalid_creator", "user/creator with this id does not exist");

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

    // neither assignees or group_assignee
    if (!assignees || assignees.length == 0) {// && !group_assignee 
        // implicitly assign to creator 
        const assignment = new TaskAssignment();
        assignment.id = uuidv4();
        assignment.task = task.id;
        assignment.user_assignee = creator;
        // set assignment.group_assignee if specified after checking in group
        await getConnection().manager.save(task);
        await getConnection().manager.save(assignment);
        return task.id;
    }
    
    // if (!assignees && group_assignee && check creator and assignees in group/project) {
    //     set group assignee
    // }
    
    // save assignment in database if specified, 
    // change validAssignees to check same group/project as well
    if (assignees && assignees.length > 0 && (await validAssignees(creator, assignees))) {
        await getConnection().manager.save(task); // may need to move this line for group
        for (const assignee of assignees) {
            const assignment = new TaskAssignment();
            assignment.id = uuidv4();
            assignment.task = task.id;
            assignment.user_assignee = assignee;
            // set assignment.group_assignee if specified after checking in group
            await getConnection().manager.save(assignment);
        }
    } else {
        throw new ApiError("createTask/invalid_assignees","invalid assignees, they must be connected or in same group");
    }

    // return task id
    return task.id;
}
