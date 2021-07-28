import { FindOperator, getConnection, ILike, LessThan, In } from "typeorm";
import _ from 'lodash';
import {Task, Status} from "../entity/Task";
import { User } from "../entity/User";
import { ApiError } from "../errors";
import { TaskAssignment } from "../entity/TaskAssignment";

interface Search {
    id? : FindOperator<string[]>;
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
    user_assignee: string[] | null = null // assuming this is their id
) : /*Promise<Task[]>*/ Promise<any> {
    let search : Search = {};

    // add values if they exist
    if (title) {search["title"] = ILike(`%${title}%`)};
    if (description) {search["description"] = ILike(`%${description}%`)};
    if (project) {search["project"] = project};
    if (creator) {
        let user = await getConnection()
        .getRepository(User)
        .find({ where: { id: creator } });
        search["creator"] = user;
    };
    if (deadline) {
        let date = new Date(Number(deadline) * 1000);
        search["deadline"] = LessThan(date);
    };
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
    };
    if (estimated_days){search["estimated_days"] = Number(estimated_days)};

    let all_assignees = [me];
    if(user_assignee) {all_assignees = all_assignees.concat(user_assignee)};

    // gets all task assignments
    let task_assignments = await getConnection().getRepository(TaskAssignment).find({
        where : {user_assignee : In(all_assignees)},
        relations : ["task"]
    });

    // finds all the tasks that match 
    let matching_tasks = task_assignments.map(task => {
        return {
            user: task.user_assignee,
            user_id: Object(task.user_assignee).id,
            task_id: Object(task.task).id,
            task: Object(task.task)
        }
    })
    
    // group tasks by task id
    let tasks_grouped = _.mapValues(_.groupBy(matching_tasks, 'task_id'),
                          clist => clist.map(matching_tasks => _.omit(matching_tasks, 'task_id')));

    // gets all users assigned to each task 
    let user_list_by_task = Object.keys(tasks_grouped).map(key => {
        return {
            user_list: tasks_grouped[key].map(task_obj => task_obj.user_id),
            task: tasks_grouped[key][0].task // same tasks are already grouped
        }
    });

    // makes sure user has access to those tasks
    let return_tasks = user_list_by_task.filter(task_obj => task_obj.user_list.includes(me));
    return_tasks = return_tasks.map(obj => obj.task.id);
    // @ts-ignore
    search["id"] = In(return_tasks)

    // find the tasks from the list of tasks me has access to that matches criteria
    let tasks = await getConnection().getRepository(Task).find({
        where: search
    })

    return tasks
}