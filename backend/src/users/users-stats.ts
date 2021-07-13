import { addWeeks, startOfToday } from "date-fns";
import { Status, Task } from "../entity/Task";
import { getConnection, Between } from "typeorm";

export type Stats = {
  businessThisWeek: number;
  tasksThisWeek: number;
  businessLastWeek: number;
  tasksLastWeek: number;
};

const DEFAULT_DAYS_OF_WORK = 1;

const getDaysOfWork = (tasks: Task[]): number =>
  tasks.reduce(
    (acc, currentTask) =>
      acc + (currentTask.estimated_days || DEFAULT_DAYS_OF_WORK),
    0
  );

const getBusinessMetric = (daysOfWork: number) =>
  Math.ceil((daysOfWork / 5) * 100);

export const getStatsForUser = async (userId: string): Promise<Stats> => {
  const today = startOfToday();
  const dateInOneWeek = addWeeks(today, 1);
  const dateOneWeekAgo = addWeeks(today, -1);

  const taskRepository = getConnection().getRepository<Task>(Task);

  const tasksDueThisWeek = await taskRepository.find({
    // TODO Also get tasks that this user is assigned to
    where: [{ creator: userId, deadline: Between(today, dateInOneWeek) }],
  });

  const estimatedDaysOfWork = getDaysOfWork(tasksDueThisWeek);

  const tasksCompletedLastWeek = await taskRepository.find({
    // TODO Also get tasks that this user is assigned to
    where: [
      {
        creator: userId,
        deadline: Between(dateOneWeekAgo, today),
        status: Status.COMPLETED,
      },
    ],
  });

  const lastWeekDaysOfWork = getDaysOfWork(tasksCompletedLastWeek);

  return {
    businessThisWeek: getBusinessMetric(estimatedDaysOfWork),
    tasksThisWeek: tasksDueThisWeek.length,
    businessLastWeek: getBusinessMetric(lastWeekDaysOfWork),
    tasksLastWeek: tasksCompletedLastWeek.length,
  };
};
