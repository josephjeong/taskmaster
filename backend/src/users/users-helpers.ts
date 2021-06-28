/*
helper functions for users files
*/

import "dotenv/config"
import bcrypt from "bcrypt";
import { getConnection } from "typeorm";

import { decode, encode, TAlgorithm } from "jwt-simple";
import {User} from "../entity/User";
import {Session, EncodeResult } from "./users-interface"

// JWT variables
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALG : TAlgorithm = "HS512"; 

/** hashes and salts password with bcrypt */
export async function passwordHash(password : string) : Promise<string> {

    // define number of salting rounds
    const rounds = 10;

    // return hashed password
    return await bcrypt.hash(password, rounds);
}

/** simple function to match hash */
export function hashMatch(password : string, hash : string) : boolean {
    return bcrypt.compareSync(password, hash);
}

/** helper function to create JWT sessions */
export function createSession(id : string) : EncodeResult {

    // details to create the secret
    const iat = Date.now();
    const exp = iat + 172800000; // add two days to expiry
    const session : Session = {
        id: id,
        iat: iat,
        exp: exp
    };

    // encode the secret
    return {
        token: encode(session, JWT_SECRET, JWT_ALG),
        iat: iat,
        exp: exp
    };
}

/** simple helper function to access id from token */
export function decodeJWTPayload(token : string) : Promise<Session> {
    return decode(token, JWT_SECRET, true, JWT_ALG);
}

/** checks if email matches valid email regex */
export function regexEmailCheck(email : string){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(email).toLowerCase())) {throw "Please Provide a Valid Email";}
}

/** checks if email already exists */
export async function existingEmailCheck(email : string) {
    const existing_users = await getConnection().getRepository(User).find({ where: {email: email} });
    if(existing_users.length) {throw "This email already has an account! Please log in."};
}