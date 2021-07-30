/*
File to create calendar ts

Written by Jocelyn Hing 27 June
*/
import { CalendarCredential } from "./entity/CalendarCredential";
import { User } from "./entity/User";
import { getConnection } from "typeorm";
import { ApiError } from "./errors";

/* function to create and store CalendarCredential in database*/
export async function createCalendarCredential(
  user: User,
  refreshToken: string,
  accessToken: string
): Promise<any> {
  const calendarCredentialRepo = getConnection().getRepository(CalendarCredential);

  if (
    await calendarCredentialRepo.findOne({
      where: [
        { user: user.id, token: refreshToken }
      ]
    })
  ) {
    throw new ApiError(
      "create_calendar_credential/calendar_credential_exists",
      "Calendar credential already exists"
    );
  }

  const calendarCredential = new CalendarCredential();
  calendarCredential.user = user.id;
  calendarCredential.refresh_token = refreshToken;
  calendarCredential.access_token = accessToken;
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

