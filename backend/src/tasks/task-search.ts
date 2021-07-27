import { FindOperator, getConnection, ILike, LessThan } from "typeorm";
import {Task, Status} from "../entity/Task";
import { User } from "../entity/User";
import { ApiError } from "../errors";
import { TaskAssignment } from "../entity/TaskAssignment";

interface Search {
    title?: FindOperator<string>;
    description?: FindOperator<string>;
    project?: string;
    creator?: any;
    deadline?: FindOperator<Date>;
    status?: Status;
    estimated_days?: number
}

export async function taskSearch(
    me: string,
    title: string | null = null,
    description: string | null = null,
    project: string | null = null,
    creator: string | null = null, // needs to be converted to User object
    // deadline assumes all events tasks before deadline
    deadline: string | null = null, // needs to be converted to date
    status: string | null = null, // needs to be converted to status
    estimated_days: string | null = null, // needs to be converted to number
    user_assignee: string | null = null, // assuming this is their id
    group_assignee: string | null = null // assuming this is their id
) : Promise<Task[]> {
    let search : Search = {};

    // add values if they exist
    if (title) {search["title"] = ILike(`%${title}%`)}
    if (description) {search["description"] = ILike(`%${description}%`)}
    if (project) {search["project"] = project}
    if (creator) {
        let user = await getConnection()
        .getRepository(User)
        .find({ where: { id: creator } });
        search["creator"] = user;
    }
    if (deadline) {
        let date = new Date(Number(deadline) * 1000);
        search["deadline"] = LessThan(date);
    }
    if (status) {
        let state : Status | null = null;
        switch(status){
            case "TO_DO": state = Status.NOT_STARTED; break;
            case "IN_PROGRESS": state = Status.IN_PROGRESS; break;
            case "BLOCKED": state = Status.BLOCKED; break;
            case "DONE": state = Status.COMPLETED; break;
            default: throw new ApiError("task_search/not_valid_status", "Not a valid Status");
        }
        search["status"] = state
    }
    if (estimated_days){search["estimated_days"] = Number(estimated_days)}

    let tasks = await getConnection().getRepository(TaskAssignment).find({
        where : {user_assignee : me},
        relations : ["task"]
    });

    console.log(tasks)

    // let tasks = await getConnection().getRepository(Task).find({
    //     where : search,
    //     relations
    // })

    return tasks
}