/*
File to create connection requests and accept/decline between users in backend from request from frontend

Written by Jocelyn Hing 27 June
*/

import { getConnection } from "typeorm";

import { Connection } from "./entity/Connection";

/* function to create and store Connection in database*/
export async function createUserConnection(
    requestee : String,
    requester : String,

) : Promise<any> {

    const connRepo = getConnection().getRepository(Connection);
    
    if (await connRepo.findOne({where : {requestee : requestee, requester: requester}})) {
        return ('Connection already exists');
    }
    if (await connRepo.findOne({where : {requestee : requester, requester: requestee}})) {
        return ('Connection already exists');
    }
    const conn = new Connection();
    conn.requestee = requestee;
    conn.requester = requester;
    conn.accepted = false;

    try {
        await getConnection().manager.save(conn);
    } catch (e) {
        console.error(e);
        return ('Error saving connection: ' + e);
    }
    return true;
}

/* function to accept and save changes in database*/
export async function acceptRequest(
    requestee : String,
    requester : String,
): Promise<any> {
    const connRepo = getConnection().getRepository(Connection);
    const conn = await connRepo.findOne({where : {requestee : requestee, requester: requester}});
    conn.accepted = true;
    try {
        await connRepo.save(conn);
    } catch (e) {
        console.error(e);
        return ('Error accepting connection: ' + e);
    }
    return true;
}


/* function to delete and remove in database*/

export async function declineRequest(
    requestee : String,
    requester : String,
): Promise<any> {
    const connRepo = getConnection().getRepository(Connection);
    const conn = await connRepo.findOne({where : {requestee : requestee, requester: requester}});
    try {
        await connRepo.delete(conn);
    } catch (e) {
        console.error(e);
        return ('Error deleting connection: ' + e);    }
    return true;
}

/* function to check if user is connected*/

export async function isConnected(
    requestee : String,
    requester : String,
): Promise<any> {
    const connRepo = getConnection().getRepository(Connection);
    const conn = await connRepo.find({where : {requestee : requestee, requester: requester}});
    if (conn.length == 0) {
        const connCheck = await connRepo.find({where : {requestee : requester, requester: requestee}});
        if (connCheck.length == 0) {
            return "unconnected";
        }
        else {
            if (connCheck[0].accepted == true) {
                return "connected";
            }
            else {
                return "requested";
            }
        }
    }
    else {
        if (conn[0].accepted == true) {
            return "connected";
        }
        else {
            return "requested";
        }
    }
}