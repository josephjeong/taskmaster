import { User } from "../entity/User";
import { Task } from "../entity/Task";
import { subDays } from "date-fns";
import { getCalendarCredential } from "../calendar-credentials";
import { calendar } from "googleapis/build/src/apis/calendar";
import { CalendarCredential } from "../entity/CalendarCredential";
import { TaskAssignment } from "../entity/TaskAssignment";
import { getConnection } from "typeorm";


export function getCalendarEventStartTime(task: Task) {
    const endDate = task.deadline;
    const estimatedDays = task.estimated_days;
    const startDate = subDays(endDate, estimatedDays);
    return startDate;
}

export async function saveTaskToCalendar(task: Task) {
    // find user's calendar's credentials
    getCalendarCredentialsList(task);
    // get start date  
    const startDate = getCalendarEventStartTime(task);


    // save 

}

export async function getUsersAllocatedToTask(task: Task): Promise<any> {
    const taskAssignmentRepo = getConnection().getRepository(TaskAssignment);
    const taskAssignments = await taskAssignmentRepo.find({ where: { id: task.id }});
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

export async function getCalendarCredentialsList(task: Task): Promise<any> {
    
    let userSet = await getUsersAllocatedToTask(task);
    let calCreds = [];
    for (let userId of userSet) {
        if (getCalendarCredential(userId) != null) {
            calCreds.push(getCalendarCredential(userId));
        }
    }    
    return calCreds;
}

