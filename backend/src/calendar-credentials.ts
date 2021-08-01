/*
File to create calendar ts

Written by Jocelyn Hing 27 June
*/
import { CalendarCredential } from "./entity/CalendarCredential";
import { User } from "./entity/User";
import { getConnection } from "typeorm";
import { ApiError } from "./errors";
import { google } from "googleapis";

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;

const GCP_CLIENT_ID = process.env.GCP_CLIENT_ID;
const GCP_CLIENT_SECRET = process.env.GCP_CLIENT_SECRET;
const GCP_REDIRECT_URL = process.env.GCP_REDIRECT_URL;

const oauth2Client = new google.auth.OAuth2(
    GCP_CLIENT_ID,
    GCP_CLIENT_SECRET,
    GCP_REDIRECT_URL
);


/* function to create and store CalendarCredential in database*/
export async function createCalendarCredential(
  user: User,
  googleCode: string
): Promise<any> {

  //decode the string
  const {tokens} = await oauth2Client.getToken(googleCode);
  oauth2Client.setCredentials(tokens);
  const calendarCredentialRepo =
    getConnection().getRepository(CalendarCredential);

//  console.log(tokens);

  if (
    await calendarCredentialRepo.findOne({
      where: [
        { user_id: user.id}
      ]
    })
  ) {
    throw new ApiError(
      "create_calendar_credential/calendar_credential_exists",
      "Calendar credential already exists"
    );
  }
  const calendarCredential = new CalendarCredential();
  calendarCredential.user_id = user.id;
  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      calendarCredential.refresh_token = tokens.refresh_token;
    }
    calendarCredential.access_token = tokens.access_token;
  });

  // const calendarCredential = new CalendarCredential();
  // calendarCredential.user_id = user.id;
  // calendarCredential.refresh_token = "1//04TvzzE3uyhTQCgYIARAAGAQSNwF-L9IrMq9hPwxTOtIUXDiy4H36HIHVJONN985up8INuykA7FN-UWeA5gfMDVEk11sdtn_8Ea8";
  // calendarCredential.access_token = "ya29.a0ARrdaM-3cfUoOPuFcbDcOGkqpm4Dbh2R2VRmNjD_9CwNHQ64gzcyBMYluR5GMWG0kYFPO4Lo4Zwe0aQdkZoR0qn9AIvO1e7hGiKvGbdEGIXm-JuEQLIs8KABZK0OBTZceOC0EtFSElf6-S9b8OKqNSlFzPA9";
  await getConnection().manager.save(calendarCredential);
  return;
}

/* function to get CalendarCredential in database*/

export async function getCalendarCredential(
  userId: String,
): Promise<CalendarCredential> {
  const calCredRepo = await getConnection().getRepository(CalendarCredential);
  const calCred = await calCredRepo.findOne({ where: { user_id: userId }});
  return calCred;
}
