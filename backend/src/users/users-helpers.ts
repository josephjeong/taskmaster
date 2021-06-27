/*
helper functions for users files
*/

import bcrypt from "bcrypt";
import fs from "fs";
import { encode, TAlgorithm } from "jwt-simple";

import {Session, EncodeResult } from "./session-interface"

/** create random string of characters of specified length */
function randomString(length : number) : string {
    // create random string of characters
    let rs = '';
    const chars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\n';
    for (let i = 0; i < length; i++) {
        rs += chars[Math.floor(Math.random() * chars.length)];
    }
    return rs;
}

/** retrieves JWT_SECRET or creates if file doesn't exist */
function handleJWTSecret() : string {
    const path = __dirname + "/JWT_SECRET.txt";

    // if file exists, return whats in it
    if (fs.existsSync(path)) { return fs.readFileSync(path, 'utf8');}

    // if file doesn't exist, create the secret and return it
    const secret = randomString(5000);
    fs.writeFileSync(path, secret);
    return secret;
}

// JWT variables
const JWT_SECRET = handleJWTSecret();
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