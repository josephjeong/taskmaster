import { isConnected } from "../connection";
import { TaskAssignment } from "../entity/TaskAssignment";
import { getConnection } from "typeorm";

export async function validAssignees(
    editor: string,
    assignees: string[]
) : Promise<boolean> { 
    for (const assignee of assignees) {
        if (await isConnected(editor, assignee) != "connected" && editor != assignee) 
            return false;
    }
    return true;
}

export async function deleteAssignment(
    id : string
) : Promise<boolean> {
    const assignment_repo = await getConnection().getRepository(TaskAssignment);
    const to_remove = await assignment_repo.findOne({where : {id : id}});
    if (!to_remove) return false;
    await assignment_repo.remove(to_remove);
    return true;
}

// delete assignments by task id