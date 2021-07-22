import React from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar, Typography } from '@material-ui/core';

import { useAcceptConnection, useDeclineConnection, useDeleteConnection, useIncomingConnectionRequests, useOutgoingConnectionRequests } from '../../api';

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
  onClose: () => void
};

const ConnectionsModal = ({
  open,
  onClose
}: ConnectionsModalProps) => {
  const { data: incomingRequests } = useIncomingConnectionRequests();
  const { data: outgoingRequests } = useOutgoingConnectionRequests();

  const acceptConnection = useAcceptConnection();
  const declineConnection = useDeclineConnection();
  const deleteConnection = useDeleteConnection();

  const classes = useStyles();

  if (!incomingRequests || !outgoingRequests) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
    >
    <DialogTitle>Connection Requests</DialogTitle>
      <DialogContent>
        {incomingRequests.length + outgoingRequests.length === 0 ? (
          <Typography>No requests</Typography>
        ) : null}
        {incomingRequests.map((request) => (
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
                onClick={() => acceptConnection(request.id)}
              >
                Accept
              </Button>
              <Button
                size='medium'
                onClick={() => declineConnection(request.id)}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
        {outgoingRequests.map((request) => (
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
                onClick={() => deleteConnection(request.id)}
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
    </Dialog>
  )
};

export default ConnectionsModal;
