/*
File to create users in backend from request from frontend

Written by Joseph Jeong 26 JUN 2021
*/

import {v4 as uuidv4} from "uuid";
import { createConnection } from "typeorm";

import {User} from "../entity/User";
import {createSession, passwordHash} from "./users-helpers"

/** function to create and store user in database with bcrypt password */
export async function createUser(
    email : string,
    password : string,
    first_name : string,
    last_name : string,
    bio : string
) : Promise<string> {

    // create new user
    const user = new User();
    user.email = email;
    user.first_name = first_name;
    user.last_name = last_name;
    user.bio = bio;

    // give user uuid
    user.id = uuidv4();

    // hash user password
    user.password_hash = await passwordHash(password);

    // save the user
    const connection = await createConnection()
    await connection.manager.save(user) 

    // create a JWT token for session
    const token = createSession(user.id);
    return token.token;
}

