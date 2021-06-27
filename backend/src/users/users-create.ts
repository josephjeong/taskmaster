/*
File to create users in backend from request from frontend

Written by Joseph Jeong 26 JUN 2021
*/

import {v4 as uuidv4} from "uuid";
import { getConnection } from "typeorm";

import {User} from "../entity/User";
import {createSession, passwordHash} from "./users-helpers"

/** checks if email matches valid email regex */
export function regexEmailCheck(email : string) : boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/** function to create and store user in database with bcrypt password */
export async function createUser(
    email : string,
    password : string,
    first_name : string,
    last_name : string,
    bio : string
) : Promise<string> {

    // check if email is valid
    if (!regexEmailCheck(email)) {throw "Please Provide a Valid Email";}

    // check if email is already in use
    console.log(email);
    const existing_users = await getConnection().getRepository(User).find({ where: {email: email} });
    console.log(existing_users);
    if(existing_users.length) {throw "This email already has an account! Please log in."};

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
    await getConnection().manager.save(user) 

    // create a JWT token for session
    const token = createSession(user.id);
    return token.token;
}

