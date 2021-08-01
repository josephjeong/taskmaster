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

const oauth2Client = new google.auth.OAuth2(
    GCP_CLIENT_ID,
    GCP_CLIENT_SECRET,
    GCP_REDIRECT_URL
);
export function getCalendarEventStartTime(task: Task) {
    const endDate = task.deadline;
    const estimatedDays = task.estimated_days;
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - estimatedDays);
    return startDate;
}

export async function saveTaskToCalendar(task_id: String) {
    // find user's calendar's credentials
    const taskRepo = getConnection().getRepository(Task);
    const task = await taskRepo.findOne({ where: { id: task_id } });

    const event = {
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

    listOfTaskAssigneeAccessTokens.forEach( (accessToken: string) => {

        oauth2Client.credentials.access_token = accessToken;
        var calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        calendar.events.insert({
            auth: oauth2Client,
            calendarId: 'primary',
            requestBody: event
        }, function (err: any, res: any) {
            if (err) {
                return err;
            }
            });
       });
    }

export async function getUsersAllocatedToTask(task: Task): Promise<any> {
    const taskAssignmentRepo = getConnection().getRepository(TaskAssignment);
    const taskAssignments = await taskAssignmentRepo.find({ where: { task: task.id } });
     let userSet = new Set();
    for (const taskAssignment of taskAssignments) {
        if (!userSet.has(taskAssignment.group_assignee)) {
            const user = taskAssignment.user_assignee as any;
            userSet.add(user.id);
        }
    }
    return userSet;
}
/*A function that retutns an array of calendar credentials of the assignees of the given task*/
export async function getCalendarCredentialsList(task: Task): Promise<String[]> {
    let userSet = await getUsersAllocatedToTask(task);
    let calCreds = new Array() as Array<String>;
    for (let userId of userSet) {
        if (await getCalendarCredential(userId) != null) {
            const calCred = await (await getCalendarCredential(userId)).access_token;
            calCreds.push(calCred);
        }
    }

    // //force a promise return
    return new Promise((resolve, reject) => {
        resolve(calCreds);
    });
}

