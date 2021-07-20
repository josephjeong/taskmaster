import React from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar, Typography } from '@material-ui/core';

import { User } from '../../types';

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
  },
  user: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  userProfileShort: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 60,
    height: 60
  },
  userActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

type ConnectionsModalProps = {
  open: boolean,
  incoming: User[],
  setIncoming: (requests: User[]) => void,
  outgoing: User[],
  setOutgoing: (requests: User[]) => void,
  onClose: () => void
};

const ConnectionsModal = ({
  open,
  incoming,
  setIncoming,
  outgoing,
  setOutgoing,
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
          {incoming.map((request) => (
            <div key={request.id} className={classes.user}>
              <div className={classes.userProfileShort}>
                <Avatar
                  alt={request.email}
                  src={request.avatar_url}
                  className={classes.avatar}
                />
                <Typography>{`${request.first_name} ${request.last_name}`}</Typography>
              </div>
              <div className={classes.userActions}>
                <Button
                  size='medium'
                  color='primary'
                  variant='contained'
                  onClick={() => {}}
                >
                  Accept
                </Button>
                <Button
                  size='medium'
                  onClick={() => {}}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
          {outgoing.map((request) => (
            <div key={request.id} className={classes.user}>
              <div className={classes.userProfileShort}>
                <Avatar
                  alt={request.email}
                  src={request.avatar_url}
                  className={classes.avatar}
                />
                <Typography>{`${request.first_name} ${request.last_name}`}</Typography>
              </div>
              <div className={classes.userActions}>
                <Button
                  size='medium'
                  onClick={() => {}}
                >
                  Cancel Request
                </Button>
              </div>
            </div>
          ))}
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
