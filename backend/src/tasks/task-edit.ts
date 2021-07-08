import { getConnection } from "typeorm";
import { isConnected } from "../connection";
import {TaskAssignment} from "../entity/TaskAssignment";
import {v4 as uuidv4} from "uuid";


import { Task, Status } from "../entity/Task";

/** function to edit task in database, only creator of the task can edit */
export async function editTask(
    task_id : string,
    editor : string,
    title? : string | null,
    deadline? : Date | null,
    status? : Status | null,
    description? : string | null,
    estimated_days? : number | null,
    assignee? : string | null
) : Promise<void> {

    if (!(task_id && editor)) {
        throw "task id or editor id invalid"
    }

    // check at least one of the other params are defined
    if (!(title || deadline || status || description || estimated_days || assignee)) { // && project
        throw "error editing task with given params, ensure at least one field is defined or not empty";
    }
    
    // check valid status
    if (status && !Object.values(Status).includes(status)) {
        throw "invalid task status"
    }
    
    // ensure deadline in the future
    if (deadline && deadline.getTime() <= Date.now()) {
        throw "deadline must be in the future"
    }
    
    // ensure estimated_days is positive
    if (estimated_days != null && estimated_days <= 0) {
        throw "estimated_days must be >= 0"
    }
    
    // get task
    let tasks = await getConnection().getRepository(Task).find({where : {id : task_id}});
    
    if (tasks.length != 1) {
        throw "either task does not exist or duplicate task ids exist";
    }
    
    // check editor is creator of task
    if (tasks[0].creator != editor) {
        throw "this user cannot edit this task, only it's creator"
    }
    
    if (title)
        tasks[0].title = title;
    if (deadline)
        tasks[0].deadline = deadline;
    if (status)
        tasks[0].status = status;
    if (description)  
        tasks[0].description = description;
    if (estimated_days)
        tasks[0].estimated_days = estimated_days;
    // maybe check same group/project
    if (assignee && (await isConnected(editor, assignee) == "connected" || editor == assignee)) {
        const assignment = await getConnection().getRepository(TaskAssignment).find({where : {task : task_id}});
        if (assignment.length == 0) {
            const new_assignment = new TaskAssignment();
            new_assignment.id = uuidv4();
            new_assignment.task = task_id;
            new_assignment.user_assignee = assignee;
            await getConnection().manager.save(new_assignment);
        } else {
            if (assignee == "None") assignment[0].user_assignee = null;
            else assignment[0].user_assignee = assignee;
            await getConnection().manager.save(assignment[0]);
        }
    }
    // edit group_assignee

    // save task
    await getConnection().manager.save(tasks[0]);

    return;
}
