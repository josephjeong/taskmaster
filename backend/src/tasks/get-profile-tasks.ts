import { getConnection } from "typeorm";
import { TaskAssignment } from "../entity/TaskAssignment"
import { isConnected } from "../connection";

/** function to get tasks a connected user is assigned, sorted by closer deadline */
export async function getProfileTasks(
    user_id : string,
    profile_user_id : string
) : Promise<any> {

    if (!(user_id && profile_user_id)) {
        throw "a user id provided is invalid"
    }
    
    // for later: show common group/project tasks even if not connected?
    
    // if users are not connected, return empty
    if (user_id != profile_user_id && !(await isConnected(user_id, profile_user_id) == "connected")) {
        return [];
    }
    
    // get task assignments
    const task_assignments = await getConnection().getRepository(TaskAssignment).find({where : {user_assignee: profile_user_id}, relations:["task", "user_assignee"]});
    
    const tasks = task_assignments.map(a => a.task);
    
    // sort by deadline, closer deadlines first
    tasks.sort(function compare(a : any, b : any) {
        return a.deadline.getTime() - b.deadline.getTime();
    });
    
    return tasks;
}