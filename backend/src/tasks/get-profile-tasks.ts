import { getConnection } from "typeorm";

import {Task, Status} from "../entity/Task";
import {Connection} from "../entity/Connection"
import {isConnected} from "../connection"

/** function to get tasks a connected user has created, probably will change later to assigned tasks */
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
    
    // get tasks
    let tasks = await getConnection().getRepository(Task).find({where : {creator: profile_user_id}}); // change creator

    return tasks;
}