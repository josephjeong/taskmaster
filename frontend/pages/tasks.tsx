import React from "react";
import { makeStyles, Container, Button } from "@material-ui/core";
import moment from "moment";

import { useMyTasks, useCreateTask } from "../api/tasks";
import { Task, TaskStatus } from "../types";
import Spacing from "../components/shared/Spacing";
import Stack from "../components/shared/Stack";
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
  const { data: tasks } = useMyTasks();

  const [showCreateTaskModal, setShowCreateTaskModal] = React.useState(false);

  const defaultTask = React.useMemo(
    () => ({
      id: "0",
      title: "",
      description: "",
      deadline: moment().add(1, "h"),
      status: TaskStatus.NOT_STARTED,
      estimated_days: 1,
    }),
    // eslint-disable-next-line
    [showCreateTaskModal]
  );

  const classes = useStyles();

  const createTaskCallback = useCreateTask();

  const createTask = async (task: Task) => {
    await createTaskCallback(task);
    setShowCreateTaskModal(false);
  };

  if (!tasks) {
    return null;
  }

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
      <Spacing y={3} />
      <TaskModal
        mode="create"
        open={showCreateTaskModal}
        taskInit={defaultTask}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={(taskUpdates) =>
          createTask(Object.assign({} as Task, defaultTask, taskUpdates))
        }
      />
      <Stack spacing={2}>
        {tasks.map((task) => (
          <TaskListItem key={task.id} task={task} isEditable />
        ))}
      </Stack>
    </Container>
  );
};

export default TasksPage;
