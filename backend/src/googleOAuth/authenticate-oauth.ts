const { google } = require('googleapis');
const http = require('http');
const jwt = require('jsonwebtoken');

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

        // Only get GoogelCalendar scopes
        scope: 'https://www.googleapis.com/auth/calendar'
    });
}

//Handler for the /oauth2callback endpoint defined in index.ts
export function getOAuthToken(request: any, resultCallback: any){
    if (request.query.error) {
      // For whatever reason, the OAuth request errorred out, ie user did not grant permissions
      // so redirect to '/'
      return resultCallback.redirect('/');
    } else {
      // Attempt to get the token from the response from the GCP OAuth provider
      oauth2Client.getToken(request.query.code, function(err: Error, token: string) {
        // If any error occurs, then redirect the user to '/'
        if (err){
            return resultCallback.redirect('/');
        }

        // The request was a success. store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
        resultCallback.cookie('jwt', jwt.sign(token, JWT_SECRET));
        
        //redirect the user somewhere
        return resultCallback.redirect('/tasks');
      });
    }
  }