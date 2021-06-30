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
import {
  fetchProfile,
  UpdateProfileInput,
  useUpdateProfile,
  useUserProfile,
} from "../../api";
import { useAuthContext } from "../../context/AuthContext";

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

const ProfilePage: React.FC<ProfilePageProps> = ({
  profile: initialProfile,
}) => {
  const classes = useStyles();
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.UNCONNECTED
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { user } = useAuthContext();
  const { data: profile } = useUserProfile(initialProfile.id, initialProfile);

  const updateProfile = useUpdateProfile();

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

  const handleProfileSave = async (changes: UpdateProfileInput) => {
    console.log("page");
    updateProfile(changes);
  };

  // TODO: Figure out a better way to handle this
  // * NB: This shouldn't happen since we should be getting a profile on the server
  if (!profile) return null;

  const isProfileOfLoggedInUser = user && user.id === profile.id;

  const userName = `${profile.first_name} ${profile.last_name}`;

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
          {isProfileOfLoggedInUser ? (
            <Button
              onClick={() => setShowUpdateModal((p) => !p)}
              color="primary"
              variant="contained"
            >
              Edit Profile
            </Button>
          ) : (
            <ConnectionButton
              status={connectionStatus}
              onClick={handleConnectionButtonClick}
            />
          )}
        </div>
      </div>

      <div>
        <UpdateProfileModal
          open={showUpdateModal}
          currentProfile={profile}
          onSave={handleProfileSave}
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
