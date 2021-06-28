import React from 'react';
import { makeStyles, Container, Button } from '@material-ui/core';
import moment from 'moment';

import { Task, TaskStatus } from '../types';
import CreateTaskModal from '../components/task/CreateTaskModal';

const DEFAULT_CREATE_TASK = {
  id: 'test',
  title: '',
  description: '',
  deadline: moment(),
  status: TaskStatus.TO_DO,
  estimatedDays: 1
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
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [showCreateTaskModal, setShowCreateTaskModal] = React.useState(false);

  const classes = useStyles();

  const createTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowCreateTaskModal(false);
  };

  return (
    <Container className={classes.root}>
      <Button onClick={() => setShowCreateTaskModal(showCreateTaskModal => !showCreateTaskModal)}>
        Toggle Create Task Modal
      </Button>
      <CreateTaskModal
        open={showCreateTaskModal}
        taskInit={DEFAULT_CREATE_TASK}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={(task) => createTask(task)}
      />
      {tasks.map((task) => (
        <Button
          key={task.id}
          size='large'
          color='primary'
          variant='contained'
        >
          {`Edit Task "${task.title}"`}
        </Button>
      ))}
    </Container>
  )
}

export default TasksPage;
