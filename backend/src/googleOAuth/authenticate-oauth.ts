const { google } = require('googleapis');
const http = require('http');
const jwt = require('jsonwebtoken');
import { User } from "../entity/User";
import { getConnection } from "typeorm";
import { createCalendarCredential } from "../calendar-credentials";
import { decodeJWTPayload } from "../users/users-helpers";

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;

const GCP_CLIENT_ID = process.env.GCP_CLIENT_ID;
const GCP_CLIENT_SECRET = process.env.GCP_CLIENT_SECRET;
const GCP_REDIRECT_URL = process.env.GCP_REDIRECT_URL;

const JWT_SECRET = process.env.JWT_SECRET;

const oauth2Client = new google.auth.OAuth2(
    GCP_CLIENT_ID,
    GCP_CLIENT_SECRET,
    GCP_REDIRECT_URL
);

//Generates the link for the client to start the auth process.
export function generateAuthUrl() {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        prompt: 'consent',
        // Only get GoogelCalendar scopes
        scope: 'https://www.googleapis.com/auth/calendar'
    });
    return url;
}

//Handler for the /oauth2callback endpoint defined in index.ts
export async function getOAuthToken(request: any, resultCallback: any){
    if (request.query.error) {
      // For whatever reason, the OAuth request errorred out, ie user did not grant permissions
      // so redirect to '/'
      return resultCallback.redirect('/login');
    } else {
      // Attempt to get the token from the response from the GCP OAuth provider
        const tokens = await oauth2Client.getToken(request.query.code);
        
        // store the token 
        const userRepo = getConnection().getRepository(User);

        const jwt = request.headers.cookie.substring(4);

        const decodedJWT = await decodeJWTPayload(request.headers.cookie.substring(4));

        const user = await userRepo.findOne({ where: { id: decodedJWT.id } });
        
        const calendarCredential = await createCalendarCredential(user, tokens.tokens.refresh_token);

        return calendarCredential;
    }
  }