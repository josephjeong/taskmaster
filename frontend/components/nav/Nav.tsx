import React from "react";
import Link from "next/link";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Container,
  Typography,
  Tooltip,
} from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";
import PersonIcon from "@material-ui/icons/Person";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import TasksIcon from "@material-ui/icons/EventNote";

import { User } from "../../types";
import { useAuthContext } from "../../context/AuthContext";
import ConnectionRequestsModal from "../connections/ConnectionsRequestsModal";
import { Button } from "@material-ui/core";
import { useLogout } from "../../api";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  logo: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(0.5),
    },
  },
  grow: {
    flexGrow: 1,
  },
}));

type NavProps = {};

const Nav = ({}: NavProps) => {
  const [incomingConnectionRequests, setIncomingConnectionRequests] =
    React.useState<User[]>([
      {
        id: "b59aa143-5e1c-46af-b05c-85908324e097",
        email: "soorria.ss@gmail.com",
        first_name: "Soorria",
        last_name: "Saruva",
        avatar_url: "https://mooth.tech/logo.svg",
      },
    ]);
  const [outgoingConnectionRequests, setOutgoingConnectionRequests] =
    React.useState<User[]>([
      {
        id: "b59aa143-5e1c-46af-b05c-85908324e098",
        email: "thesabinelim@gmail.com",
        first_name: "Sabine",
        last_name: "Lim",
        avatar_url:
          "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
      },
    ]);

  const [showConnectionsModal, setShowConnectionsModal] = React.useState(false);

  const { user } = useAuthContext();
  const logout = useLogout();

  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar component={Container} className={classes.toolbar}>
          <div className={classes.logo}>
            <DoneAllIcon />
            <Typography component="p" variant="h5">
              Tasker
            </Typography>
          </div>
          <div className={classes.grow} />
          {user ? (
            <>
              <Link href={`/tasks`} passHref>
                <Tooltip title="Your Tasks">
                  <IconButton
                    href={`/tasks`}
                    component="a"
                    color="inherit"
                  >
                    <TasksIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            
              <Tooltip title="Connection Requests">
                <IconButton
                  color="inherit"
                  onClick={() => setShowConnectionsModal(true)}
                >
                  <Badge
                    badgeContent={incomingConnectionRequests.length}
                    color="secondary"
                  >
                    <LinkIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Link href={`/profile/${user.id}`} passHref>
                <Tooltip title="Your Profile">
                  <IconButton
                    href={`/profile/${user.id}`}
                    component="a"
                    color="inherit"
                  >
                    <PersonIcon />
                  </IconButton>
                </Tooltip>
              </Link>

              <Button
                onClick={logout}
                variant="contained"
                color="primary"
                disableElevation
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button
                  component="a"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button
                  component="a"
                  variant="contained"
                  color="secondary"
                  disableElevation
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      {user && (
        <ConnectionRequestsModal
          open={showConnectionsModal}
          incoming={incomingConnectionRequests}
          setIncoming={(requests) => setIncomingConnectionRequests(requests)}
          outgoing={outgoingConnectionRequests}
          setOutgoing={(requests) => setOutgoingConnectionRequests(requests)}
          onClose={() => setShowConnectionsModal(false)}
        />
      )}
    </>
  );
};

export default Nav;
