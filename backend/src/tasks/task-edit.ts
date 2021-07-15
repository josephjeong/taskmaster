import { getConnection } from "typeorm";
import { TaskAssignment } from "../entity/TaskAssignment";
import { v4 as uuidv4 } from "uuid";
import { validAssignees, deleteAssignment } from "./task-helpers";
import { Task, Status } from "../entity/Task";

/** function to edit task in database, only creator of the task can edit */
export async function editTask(
    task_id : string,
    editor : string,
    title? : string | null,
    deadline? : Date | null,
    status? : Status | null,
    assignees? : string[] | null,
    description? : string | null,
    estimated_days? : number | null
) : Promise<void> {

    if (!(task_id && editor)) {
        throw "task id or editor id invalid"
    }

    // check at least one of the other params are defined
    if (!((title && title.trim().length > 0) || deadline || status || (description !== undefined && description !== null) || 
        (estimated_days !== undefined && estimated_days !== null) || assignees)) { // && group
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
    if (estimated_days !== null && estimated_days !== undefined && estimated_days < 0) {
        throw "estimated_days must be >= 0"
    }
    
    // get task
    let tasks = await getConnection().getRepository(Task).find({where : {id : task_id}, relations: ["creator"]}) as any;
    
    if (tasks.length !== 1) {
        throw "either task does not exist or duplicate task ids exist";
    }
    
    // check editor is creator of task
    if (tasks[0].creator.id !== editor) {
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
    
    // if (assignees && assignees.length === 0 && task has a group) {
    //     remove assignees and return
    //     const assignments = await getConnection().getRepository(TaskAssignment).find({where : {task : task_id}});
    //     assignment[0].user_assignee = null;
    // }
    
    if (!assignees) {
        await getConnection().manager.save(tasks[0]);
        return;
    }
    
    // if assignees [], implicit assign task to creator
    if (assignees.length === 0) {
        updateAssignments(assignees, task_id); // remove current assignees
        const assignment = new TaskAssignment();
        assignment.id = uuidv4();
        assignment.task = tasks[0].id;
        assignment.user_assignee = tasks[0].creator.id;
        await getConnection().manager.save(tasks[0]);
        await getConnection().manager.save(assignment);
        return;
    }
    
    // change validAssignees to check same group
    if (assignees.length > 0 && (await validAssignees(editor, assignees))) {
        await getConnection().manager.save(tasks[0]);
        await updateAssignments(assignees, task_id);
    } else {
        throw "invalid assignees, they must be connected or in same group";
    }

    return;
}

async function updateAssignments(
    assignees: string[],
    task_id: string
) : Promise<void> {
    const assignments = await getConnection().getRepository(TaskAssignment).find({where : {task : task_id}});
    for (const curr of assignments) {
        if (!assignees.includes(curr.user_assignee)) {
            deleteAssignment(curr.id);
        }
    }
    const current_assignees = assignments.map(a => a.user_assignee);
    for (const new_assignee of assignees) {
        if (!current_assignees.includes(new_assignee)) {
            const new_assignment = new TaskAssignment();
            new_assignment.id = uuidv4();
            new_assignment.task = task_id;
            new_assignment.user_assignee = new_assignee;
            await getConnection().manager.save(new_assignment);
        }
    }
}

