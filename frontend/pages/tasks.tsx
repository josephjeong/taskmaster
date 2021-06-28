import React from 'react';
import { makeStyles, Container, Button } from '@material-ui/core';
import moment from 'moment';

import { Task, TaskStatus } from '../types';
import TaskModal from '../components/task/TaskModal';

const DEFAULT_TASK_ATTRIBUTES = {
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
  const [showEditTaskModal, setShowEditTaskModal] = React.useState<string | null>(null);

  const classes = useStyles();

  const getDefaultTask = () => {
    return {
      ...DEFAULT_TASK_ATTRIBUTES,
      id: tasks.length.toString()
    } as Task;
  };

  const createTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowCreateTaskModal(false);
  };

  return (
    <Container className={classes.root}>
      <Button onClick={() => setShowCreateTaskModal(showCreateTaskModal => !showCreateTaskModal)}>
        Toggle Create Task Modal
      </Button>
      <TaskModal
        mode='create'
        open={showCreateTaskModal}
        taskInit={getDefaultTask()}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={(task) => createTask(task)}
      />
      {tasks.map((task) => (
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
      {tasks.map((task) => (
        <TaskModal
          key={task.id}
          mode='edit'
          open={showEditTaskModal === task.id}
          taskInit={task}
          onClose={() => setShowEditTaskModal(null)}
          onSubmit={(task) => console.log(task)}
        />
      ))}
    </Container>
  )
}

export default TasksPage;
