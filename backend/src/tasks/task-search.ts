import { getConnection } from "typeorm";
import {Task, Status} from "../entity/Task";


export async function taskSearch(
    title: string | null = null,
    project: string | null = null,
    creator: string | null = null,
    state: Status | null = null,
    assignee: string | null = null,
    deadline: string | null = null,
    status: string | null = null,
    estimated_days: string | null = null
) : Promise<Task[]> {

    

    let search = {};

    let tasks = await getConnection().getRepository(Task).find({where : search})

    return tasks
}