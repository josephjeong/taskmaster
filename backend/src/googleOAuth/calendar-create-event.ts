import { User } from "../entity/User";
import { Task } from "../entity/Task";
import { subDays } from "date-fns";


export function getCalendarEventEndTime(task: Task) {
    const endDate = task.deadline;
    const estimatedDays = task.estimated_days;
    const startDate = subDays(endDate, estimatedDays);
    return startDate;
}