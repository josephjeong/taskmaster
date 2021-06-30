import { getConnection } from "typeorm";

import {Task, Status} from "../entity/Task";
import {Connection} from "../entity/Connection"

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
    if (user_id != profile_user_id && !(usersAreConnected(user_id, profile_user_id))) {
        return [];
    }
    
    // get tasks
    let tasks = await getConnection().getRepository(Task).find({where : {creator: profile_user_id}}); // change creator

    return tasks;
}

async function usersAreConnected(
    user_id : string,
    profile_user_id : string
) : Promise<boolean> {
    let connections = await getConnection().getRepository(Connection).find({where : {requester: user_id}});
    let connections2 = await getConnection().getRepository(Connection).find({where : {requestee: user_id}});
    for (const connection of connections) {
        if (connection.requestee == profile_user_id && connection.accepted == true) return true;
    }
    for (const connection of connections2) {
        if (connection.requester == profile_user_id && connection.accepted == true) return true;
    }
    return false;
}