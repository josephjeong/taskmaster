import React from 'react';
import { makeStyles, Container, Button } from '@material-ui/core';

import { Task } from '../types';
import CreateTaskModal from '../components/task/CreateTaskModal';

const EXAMPLE_CREATE_TASK = {
  id: 'test'
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
  const [showCreateTaskModal, setShowCreateTaskModal] = React.useState(false);

  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Button onClick={() => setShowCreateTaskModal(showCreateTaskModal => !showCreateTaskModal)}>
        Toggle Create Task Modal
      </Button>
      <CreateTaskModal
        open={showCreateTaskModal}
        currentTask={EXAMPLE_CREATE_TASK}
        onClose={() => setShowCreateTaskModal(false)}
      />
    </Container>
  )
}

export default TasksPage;
