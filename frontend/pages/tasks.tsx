import React from "react";
import { makeStyles, Container, Button } from "@material-ui/core";
import moment from "moment";

import { useTasks, useCreateTask } from "../api/tasks";
import { Task, TaskStatus } from "../types";
import Spacing from "../components/shared/Spacing";
import Stack from "../components/shared/Stack";
import TaskFilterBar, { TaskFilters } from "../components/task/TaskFilterBar";
import TaskListItem from "../components/task/TaskListItem";
import TaskModal from "../components/task/TaskModal";
import Title from "../components/shared/Title";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
}));

const TasksPage = () => {
  const [filters, setFilters] = React.useState({});

  const { data: tasks } = useTasks(filters);

  const [showCreateTaskModal, setShowCreateTaskModal] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const defaultTask = React.useMemo(
    () => ({
      id: "0",
      title: "",
      description: "",
      deadline: moment().add(1, "h"),
      status: TaskStatus.NOT_STARTED,
      estimated_days: 1,
      assignees: [],
    }),
    // eslint-disable-next-line
    [showCreateTaskModal]
  );

  const classes = useStyles();

  const createTaskCallback = useCreateTask();

  const createTask = async (task: Task) => {
    setError(null);
    const { error } = await createTaskCallback(task);
    if (error) {
      setError(error.message);
    } else {
      setShowCreateTaskModal(false);
    }
  };

  return (
    <Container className={classes.root}>
      <Title>Your Tasks</Title>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() =>
          setShowCreateTaskModal((showCreateTaskModal) => !showCreateTaskModal)
        }
      >
        Create Task
      </Button>
      <Spacing y={1} />
      <TaskFilterBar
        filters={filters}
        onChange={(filters) => setFilters(filters)}
      />
      <Spacing y={3} />
      <TaskModal
        mode="create"
        error={error}
        open={showCreateTaskModal}
        taskInit={defaultTask}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={(taskUpdates) =>
          createTask(Object.assign({} as Task, defaultTask, taskUpdates))
        }
      />
      {tasks ? (
        <Stack spacing={2}>
          {tasks.map((task) => (
            <TaskListItem key={task.id} task={task} isEditable />
          ))}
        </Stack>
      ) : null}
    </Container>
  );
};

export default TasksPage;
