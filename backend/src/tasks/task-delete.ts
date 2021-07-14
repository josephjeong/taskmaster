import { getConnection } from "typeorm";
import { TaskAssignment } from "../entity/TaskAssignment";
import { Task } from "../entity/Task";

export async function deleteTask(
    id : string
) : Promise<boolean> {
    const task_repo = await getConnection().getRepository(Task);
    const to_remove = await task_repo.findOne({where : {id : id}});
    if (!to_remove) return false;
    await task_repo.remove(to_remove);
    // todo: remove task assignments associated with this task
    return true;
}
            