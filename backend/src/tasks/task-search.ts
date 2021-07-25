import { getConnection } from "typeorm";

import {Task, Status} from "../entity/Task";


export async function taskSearch(
    title?: string,
    state?: Status,
    assignee?: string,
    start_date?: string,
    end_date?: string
) : Promise<Task[]> {

    let search = {};

    let tasks = await getConnection().getRepository(Task).find({where : search})

    return tasks
}