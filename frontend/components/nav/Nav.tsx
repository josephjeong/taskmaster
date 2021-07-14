import React from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
} from "@material-ui/core";
import LinkIcon from "@material-ui/icons/Link";

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

  if (!user) {
    return null;
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className={classes.toolbar}>
          <div className={classes.grow} />
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
          <Button
            onClick={logout}
            variant="contained"
            color="primary"
            disableElevation
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <ConnectionRequestsModal
        open={showConnectionsModal}
        incoming={incomingConnectionRequests}
        setIncoming={(requests) => setIncomingConnectionRequests(requests)}
        outgoing={outgoingConnectionRequests}
        setOutgoing={(requests) => setOutgoingConnectionRequests(requests)}
        onClose={() => setShowConnectionsModal(false)}
      />
    </>
  );
};

export default Nav;
