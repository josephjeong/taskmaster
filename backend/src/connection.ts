/*
File to create connection requests and accept/decline between users in backend from request from frontend

Written by Jocelyn Hing 27 June
*/

import { getConnection } from "typeorm";

import { Connection } from "./entity/Connection";
import { ApiError } from "./errors";

/* function to create and store Connection in database*/
export async function createUserConnection(
  requestee: string,
  requester: string
): Promise<void> {
  const connRepo = getConnection().getRepository(Connection);
  if (requestee == requester) {
    throw new ApiError(
      "create_connection/connect_to_self",
      "Cannot create connection with the same user."
    );
  }
  if (
    await connRepo.findOne({
      where: [
        { requestee: requestee, requester: requester },
        { requestee: requester, requester: requestee },
      ],
    })
  ) {
    throw new ApiError(
      "create_connection/connection_exists",
      "Connection already exists"
    );
  }

  const conn = new Connection();
  conn.requestee = requestee;
  conn.requester = requester;
  conn.accepted = false;

  await getConnection().manager.save(conn);
}

/* function to accept and save changes in database*/
export async function acceptRequest(
  requestee: string,
  requester: string
): Promise<void> {
  const connRepo = getConnection().getRepository(Connection);
  const conn = await connRepo.findOne({
    where: { requestee: requestee, requester: requester },
  });
  conn.accepted = true;
  await connRepo.save(conn);
}

/* function to delete and remove in database*/

export async function declineRequest(
  requestee: string,
  requester: string
): Promise<void> {
  const connRepo = getConnection().getRepository(Connection);
  const conn = await connRepo.findOne({
    where: { requestee: requestee, requester: requester },
  });
  await connRepo.delete(conn);
}

/* function to check if user is connected*/

export async function isConnected(
  requestee: string,
  requester: string
): Promise<"unconnected" | "connected" | "requested"> {
  const connRepo = getConnection().getRepository(Connection);
  const conn = await connRepo.find({
    where: { requestee: requestee, requester: requester },
  });
  if (conn.length == 0) {
    const connCheck = await connRepo.find({
      where: { requestee: requester, requester: requestee },
    });
    if (connCheck.length == 0) {
      return "unconnected";
    } else {
      if (connCheck[0].accepted == true) {
        return "connected";
      } else {
        return "requested";
      }
    }
  } else {
    if (conn[0].accepted == true) {
      return "connected";
    } else {
      return "requested";
    }
  }
}

/* function to delete a request in database*/

export async function deleteRequest(
  requestee: string,
  requester: string
): Promise<void> {
  const connRepo = getConnection().getRepository(Connection);
  const conn = await connRepo.findOne({
    where: { requestee: requestee, requester: requester },
  });
  await connRepo.delete(conn);
}

/* function to show all of user's incoming connection requests in database*/

export async function getIncomingConnectionRequests(
  requester: string
): Promise<Connection[]> {
  const connRepo = getConnection().getRepository(Connection);
  const conn = await connRepo.find({ where: { requester: requester } });
  return conn;
}

/* function to show all of user's connection requests in database*/

export async function getOutgoingConnectionRequests(
  requestee: string
): Promise<Connection[]> {
  const connRepo = getConnection().getRepository(Connection);
  const conn = await connRepo.find({ where: { requestee: requestee } });
  return conn;
}

export async function getAcceptedConnections(
    user : String,
): Promise<any> {
    const connRepo = getConnection().getRepository(Connection);
    const connUserIsRequestee = await connRepo.find({where : {requestee: user}});
    const connUserIsRequester = await connRepo.find({where : {requester: user}});
    let acceptedConnections: Connection[] = []; 

    for (let i = 0; i < connUserIsRequestee.length; i++) {
        if (connUserIsRequestee[i].accepted) {
            acceptedConnections.push(connUserIsRequestee[i]);
        }
    }

    for (let i = 0; i < connUserIsRequester.length; i++) {
        if (connUserIsRequester[i].accepted) {
            acceptedConnections.push(connUserIsRequester[i]);
        }
    }

    try {
        return acceptedConnections;
    } catch (e) {
        console.error(e);
        return ('Error showing connections: ' + e);
    }
}

