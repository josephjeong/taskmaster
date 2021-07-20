import React from 'react';
import { makeStyles, Container, Button } from '@material-ui/core';
import moment from 'moment';

import { useMyTasks, useCreateTask, useEditTask } from '../api/tasks';
import { Task, TaskStatus } from '../types';
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
  const editTaskCallback = useEditTask();

  const createTask = async (task: Task) => {
    await createTaskCallback(task);
    setShowCreateTaskModal(false);
  };

  const editTask = async (taskUpdates: Partial<Task>) => {
    await editTaskCallback(taskUpdates);
    setShowEditTaskModal(null);
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
      {tasks.data.map((task) => (
        <Button
          key={task.id}
          size='large'
          color='primary'
          variant='contained'
          onClick={() => setShowEditTaskModal(task.id)}
        >
          {`Edit Task "${task.title}"`}
        </Button>
      ))}
      <TaskModal
        mode='edit'
        open={showEditTaskModal != null}
        taskInit={tasks.data.find((task) => task.id === showEditTaskModal) ?? {} as Task}
        onClose={() => setShowEditTaskModal(null)}
        onSubmit={(taskUpdates) => editTask(taskUpdates)}
      />
    </Container>
  )
}

export default TasksPage;
