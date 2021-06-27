/*
    interfaces for handling JWT 
*/

export interface Session {
    id: string;
    iat: number;
    exp: number;
}

 export interface EncodeResult {
    token: string,
    iat: number
    exp: number,
 }