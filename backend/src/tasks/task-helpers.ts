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
) : Promise<void> {
    const assignment_repo = getConnection().getRepository(TaskAssignment);
    await assignment_repo.delete(id);
}

// delete assignments by task id