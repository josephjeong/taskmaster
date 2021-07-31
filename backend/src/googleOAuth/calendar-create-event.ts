import { User } from "../entity/User";
import { Task } from "../entity/Task";
import { getCalendarCredential } from "../calendar-credentials";
import { CalendarCredential } from "../entity/CalendarCredential";
import { TaskAssignment } from "../entity/TaskAssignment";
import { getConnection } from "typeorm";
import { google } from "googleapis";

const GCP_CLIENT_ID = process.env.GCP_CLIENT_ID;
const GCP_CLIENT_SECRET = process.env.GCP_CLIENT_SECRET;
const GCP_REDIRECT_URL = process.env.GCP_REDIRECT_URL;

export function getCalendarEventStartTime(task: Task) {
    const endDate = task.deadline;
    const estimatedDays = task.estimated_days;
    console.log(estimatedDays);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - estimatedDays);
    return startDate;
}

export async function saveTaskToCalendar(task: Task) {
    // find user's calendar's credentials


    const oauth2Client = new google.auth.OAuth2(
        GCP_CLIENT_ID,
        GCP_CLIENT_SECRET,
        GCP_REDIRECT_URL
    );

    var event = {
        'summary': task.title,
        'location': '',
        'description': task.description,
        'start': {
            'dateTime': getCalendarEventStartTime(task).toISOString(),
            'timeZone': 'Australia/Sydney',
        },
        'end': {
            'dateTime': task.deadline.toISOString(),
            'timeZone': 'Australia/Sydney',
        },
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 },
            ],
        },
    };

    const listOfTaskAssigneeAccessTokens = await getCalendarCredentialsList(task);
    for (let accessToken in listOfTaskAssigneeAccessTokens) {
        // save 
        oauth2Client.credentials.access_token = accessToken;
        var calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            requestBody: event
        }, function (err: any, res: any) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            });
        }
    }

export async function getUsersAllocatedToTask(task: Task): Promise<any> {
    const taskAssignmentRepo = getConnection().getRepository(TaskAssignment);
    const taskAssignments = await taskAssignmentRepo.find({ where: { id: task.id } });
    const firstTaskAssignment = taskAssignments[0];
    let userSet = new Set();
    userSet.add(firstTaskAssignment.user_assignee);
    for (const taskAssignment of taskAssignments) {
        if ((taskAssignment.group_assignee != null) && (!userSet.has(taskAssignment.group_assignee))) {
            userSet.add(taskAssignment.group_assignee);
        }
    }
    return userSet;
}
/*A function that retutns an array of calendar credentials of the assignees of the given task*/
export async function getCalendarCredentialsList(task: Task): Promise<String[]> {
    let userSet = await getUsersAllocatedToTask(task);
    let calCreds = new Array() as Array<String>;;
    for (let userId of userSet) {
        if (getCalendarCredential(userId) != null) {
            calCreds.push((await getCalendarCredential(userId)).access_token);
        }
    }

    //force a promise return
    return new Promise((resolve, reject) => {
        resolve(calCreds);
    });
}

