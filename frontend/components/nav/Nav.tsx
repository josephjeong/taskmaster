import React from 'react';
import { makeStyles, AppBar, Toolbar, IconButton, Badge } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

import { useAuthContext } from '../../context/AuthContext';
import ConnectionRequestsModal from '../connections/ConnectionsRequestsModal';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  }
}));

type NavProps = {
};

const Nav = ({
}: NavProps) => {
  const [showConnectionsModal, setShowConnectionsModal] = React.useState(false);

  const { token } = useAuthContext();

  const classes = useStyles();

  if (!token) {
    return null;
  }

  return <>
    <AppBar
      position='sticky'
    >
      <Toolbar>
        <div className={classes.grow} />
        <IconButton
          color='inherit'
          onClick={() => setShowConnectionsModal(true)}
        >
          <Badge badgeContent={3} color='secondary'>
            <LinkIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
    <ConnectionRequestsModal
      open={showConnectionsModal}
      onClose={() => setShowConnectionsModal(false)}
    />
  </>;
}

export default Nav;
