/*
helper functions for users files
*/

import bcrypt from "bcrypt";
import fs from "fs";
import { encode, TAlgorithm } from "jwt-simple";

import {Session, EncodeResult } from "./session-interface"

// JWT variables
const JWT_SECRET = fs.readFileSync(__dirname + "/JWT_SECRET.txt", "utf8");
const JWT_ALG : TAlgorithm = "HS512"; 

/** hashes and salts password with bcrypt */
export async function passwordHash(password : string) : Promise<string> {

    // define number of salting rounds
    const rounds = 10;

    // return hashed password
    return await bcrypt.hash(password, rounds);
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