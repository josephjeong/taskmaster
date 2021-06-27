/*
helper functions for users files
*/

import "dotenv/config"

import bcrypt from "bcrypt";
import { decode, encode, TAlgorithm } from "jwt-simple";

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

export function decodeJWTPayload(token : string) : Promise<Session> {
    return decode(token, JWT_SECRET, true, JWT_ALG);
}