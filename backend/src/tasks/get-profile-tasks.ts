import { getConnection } from "typeorm";

import { Task } from "../entity/Task";
import { TaskAssignment } from "../entity/TaskAssignment"
import { isConnected } from "../connection"

/** function to get tasks a connected user is assigned, sorted by closer deadline */
export async function getProfileTasks(
    user_id : string,
    profile_user_id : string
) : Promise<Task[]> {

    if (!(user_id && profile_user_id)) {
        throw "a user id provided is invalid"
    }
    
    // for later: show common group/project tasks even if not connected?
    
    // if users are not connected, return empty
    if (user_id != profile_user_id && !(await isConnected(user_id, profile_user_id) == "connected")) {
        return [];
    }
    
    // get task assignments
    const task_assignments = await getConnection().getRepository(TaskAssignment).find({where : {user_assignee: profile_user_id}});
    
    // make array of task_ids 
    const task_ids = [];
    
    for (const assignment of task_assignments) {
        task_ids.push(assignment.task);
    }
    
    let tasks: Task[] = [] ;
    
    // add the tasks
    for (const task_id of task_ids) {
        const task = await getConnection().getRepository(Task).find({where : {id: task_id}});
        tasks = tasks.concat(task);
    }
    
    // sort by deadline, closer deadlines first
    tasks.sort(function compare(a, b) {
        return a.deadline.getTime() - b.deadline.getTime();
    });
    
    return tasks;
}