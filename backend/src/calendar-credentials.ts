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

//   //decode the string
//   const {tokens} = await oauth2Client.getToken(googleCode);
//   oauth2Client.setCredentials(tokens);

//   const calendarCredentialRepo = getConnection().getRepository(CalendarCredential);

// //  console.log(tokens);

//   if (
//     await calendarCredentialRepo.findOne({
//       where: [
//         { user_id: user.id}
//       ]
//     })
//   ) {
//     throw new ApiError(
//       "create_calendar_credential/calendar_credential_exists",
//       "Calendar credential already exists"
//     );
//   }
//   const calendarCredential = new CalendarCredential();
//   calendarCredential.user_id = user.id;
//   oauth2Client.on('tokens', (tokens) => {
//     if (tokens.refresh_token) {
//       // store the refresh_token in my database!
//       calendarCredential.refresh_token = tokens.refresh_token;
//     }
//     calendarCredential.access_token = tokens.access_token;
//   });

  const calendarCredential = new CalendarCredential();
  calendarCredential.user_id = user.id;
  calendarCredential.refresh_token = "1//04xzIPIgcDrrMCgYIARAAGAQSNwF-L9Ir3AqXzTUDq86a3BjDEBW4FMSAxO-Hn_nkw9tChnOLTfcMnjzdwiGzeR8YPYzVOb7R1y4";
  calendarCredential.access_token = "ya29.a0ARrdaM-5qEeYnsArOnTIBHqeyLRmbtT4EBT5HcEk6OhQj6-xV8NsCk6fZSGB6tm4RNRc_iTEe7DvtQWlrmD-_LChsEcg_37geZ8KMkDjOV6SYnEk_U11OaMC8YwSV7PbygPWBMIskvQ1pv7VOrJlW3h-uhc1";
  await getConnection().manager.save(calendarCredential);
  return;
}

/* function to get CalendarCredential in database*/

export async function getCalendarCredential(
  userId: string,
): Promise<CalendarCredential> {
  const calCredRepo = getConnection().getRepository(CalendarCredential);
  const calCred = await calCredRepo.findOne({ where: { id: userId }});
  return calCred;
}

