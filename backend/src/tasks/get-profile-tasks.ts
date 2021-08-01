import { getConnection } from "typeorm";
import { TaskAssignment } from "../entity/TaskAssignment";
import { isConnected } from "../connection";
import { Task } from "../entity/Task";
import { ApiError } from "../errors";

/** function to get tasks a connected user is assigned, sorted by closer deadline */
export async function getProfileTasks(
  user_id: string,
  profile_user_id: string
): Promise<Task[]> {
  if (!user_id)
    throw new ApiError(
      "getProfileTasks/invalid_user_id",
      "user id provided is null/undefined or empty string"
    );

  if (!profile_user_id)
    throw new ApiError(
      "getProfileTasks/invalid_profile_user_id",
      "profile id provided is null/undefined or empty string"
    );

  // for later: show common group/project tasks even if not connected?

  // if users are not connected, throw error
  if (
    user_id !== profile_user_id &&
    !((await isConnected(user_id, profile_user_id)) === "connected")
  ) {
    throw new ApiError(
      "getProfileTasks/no_perm",
      "You are unauthorised, as you aren't connected to this user"
    );
  }

  // get task assignments
  const all_assignments = await getConnection()
    .getRepository(TaskAssignment)
    .find();

  const task_assignments = all_assignments.filter(
    (a: any) => a.user_assignee.id === profile_user_id
  );

  const tasks = task_assignments.map((a) => a.task) as any;

  all_assignments.forEach((asst) => {
    delete (asst as any).user_assignee.password_hash;
  });

  for (const task of tasks) {
    task.assignees = [];
    for (const assignment of all_assignments as any) {
      if (task.id === assignment.task.id) {
        task.assignees.push(assignment.user_assignee);
      }
    }
  }

  tasks.map((task: any) => {
    delete task.creator.password_hash;
  });

  // sort by deadline, closer deadlines first
  tasks.sort(function compare(a: Task, b: Task) {
    return a.deadline.getTime() - b.deadline.getTime();
  });

  return tasks;
}
