import React from 'react';
import { makeStyles, Container, Button } from '@material-ui/core';
import moment from 'moment';

import { useMyTasks, useCreateTask } from '../api/tasks';
import { Task, TaskStatus } from '../types';
import Stack from '../components/shared/Stack';
import TaskListItem from '../components/task/TaskListItem';
import TaskModal from '../components/task/TaskModal';

const DEFAULT_TASK_ATTRIBUTES = {
  id: '0',
  title: '',
  description: '',
  deadline: moment(),
  status: TaskStatus.NOT_STARTED,
  estimated_days: 1
} as Task;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
}))

const TasksPage = () => {
  const { data: tasks } = useMyTasks();
  const [showCreateTaskModal, setShowCreateTaskModal] = React.useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = React.useState<string | null>(null);

  const classes = useStyles();

  const createTaskCallback = useCreateTask();

  const createTask = async (task: Task) => {
    await createTaskCallback(task);
    setShowCreateTaskModal(false);
  };

  if (!tasks || !tasks.data) {
    return null;
  }

  return (
    <Container className={classes.root}>
      <Button onClick={() => setShowCreateTaskModal(showCreateTaskModal => !showCreateTaskModal)}>
        Toggle Create Task Modal
      </Button>
      <TaskModal
        mode='create'
        open={showCreateTaskModal}
        taskInit={DEFAULT_TASK_ATTRIBUTES}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={(taskUpdates) => createTask(Object.assign({} as Task, DEFAULT_TASK_ATTRIBUTES, taskUpdates))}
      />
      <Stack spacing={2}>
        {tasks.data.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            isEditable
          />
        ))}
      </Stack>
    </Container>
  )
}

export default TasksPage;
