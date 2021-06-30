import { GetServerSideProps } from "next";
import { useState } from "react";
import {
  Container,
  makeStyles,
  Avatar,
  Typography,
  Button,
} from "@material-ui/core";

import { ConnectionStatus, User } from "../../types";
import ConnectionButton from "../../components/profile/ConnectionButton";
import UpdateProfileModal from "../../components/profile/UpdateProfileModal";
import Title from "../../components/shared/Title";
import { fetchProfile } from "../../api";

const EXAMPLE_USER: User = {
  id: "b59aa143-5e1c-46af-b05c-85908324e097",
  email: "soorria.ss@gmail.com",
  first_name: "Soorria",
  last_name: "Saruva",
  avatar_url: "https://mooth.tech/logo.svg",
};

interface ProfilePageProps {
  profile: User;
}

const useStyles = makeStyles((theme) => ({
  userDetailsWrapper: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(3),
    },
  },
  name: {
    fontWeight: "bold",
    marginBotton: theme.spacing(1),
  },
  userDetails: {
    flex: "1 0",
  },
  avatar: {
    width: 100,
    height: 100,
  },
}));

const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  const classes = useStyles();
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.UNCONNECTED
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const userName = `${profile.first_name} ${profile.last_name}`;

  const handleConnectionButtonClick = () => {
    setConnectionStatus((prev) => {
      switch (prev) {
        case ConnectionStatus.CONNECTED:
          return ConnectionStatus.UNCONNECTED;
        case ConnectionStatus.UNCONNECTED:
          return ConnectionStatus.REQUESTED;
        case ConnectionStatus.REQUESTED:
          return ConnectionStatus.CONNECTED;
      }
    });
  };

  return (
    <Container>
      <Title>{`${userName}'s Profile`}</Title>
      <div className={classes.userDetailsWrapper}>
        <div>
          <Avatar
            alt={userName}
            src={profile.avatar_url}
            className={classes.avatar}
          />
        </div>
        <div className={classes.userDetails}>
          <Typography variant="h4" component="h1" className={classes.name}>
            {userName}
          </Typography>
          <Typography>{profile.email}</Typography>
        </div>
        <div>
          <ConnectionButton
            status={connectionStatus}
            onClick={handleConnectionButtonClick}
          />
        </div>
      </div>

      <div>
        <Button onClick={() => setShowUpdateModal((p) => !p)}>
          Toggle Modal
        </Button>
        <UpdateProfileModal
          open={showUpdateModal}
          currentProfile={profile}
          onClose={() => setShowUpdateModal(false)}
        />
      </div>
    </Container>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps<
  ProfilePageProps,
  { userId: string }
> = async ({ params }) => {
  const profile = await fetchProfile(params!.userId);
  return {
    props: { profile },
  };
};
