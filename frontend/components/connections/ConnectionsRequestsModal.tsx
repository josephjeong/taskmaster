import React from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';

import { Task, TaskStatus } from '../../types';

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: '5px'
  },
  rowInputLeft: {
    marginRight: '2.5px',
    flex: 1
  },
  rowInputRight: {
    marginLeft: '2.5px',
    flex: 1
  },
  searchButton: {
    height: 55,
    marginLeft: 5
  }
}));

type ConnectionsModalProps = {
  open: boolean,
  onClose: () => void
};

const ConnectionsModal = ({
  open,
  onClose
}: ConnectionsModalProps) => {
  const [search, setSearch] = React.useState('');

  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
    >
      <DialogTitle>Connection Requests</DialogTitle>
      <form onSubmit={(event) => {}}>
        <DialogContent>
          <div className={classes.row}>
            <TextField
              label='Search users...'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              className={classes.searchButton}
              size='large'
              color='primary'
              variant='contained'
            >
              Connect
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            size='large'
            color='primary'
            variant='contained'
            onClick={() => onClose()}
          >
            Close
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
};

export default ConnectionsModal;
