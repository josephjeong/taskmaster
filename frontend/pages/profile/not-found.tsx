import { Container, makeStyles, Typography, fade } from "@material-ui/core";

import { User } from "../../types";
import Title from "../../components/shared/Title";
import Spacing from "../../components/shared/Spacing";
import { useRouter } from "next/router";

interface ProfilePageProps {
  profile: User;
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "bold",
    marginBotton: theme.spacing(1),
    textAlign: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  invalid: {
    padding: "2px 4px",
    borderRadius: theme.shape.borderRadius,
    background: fade(theme.palette.common.black, 0.1),
  },
}));

const ProfilePage: React.FC<ProfilePageProps> = () => {
  const router = useRouter();
  const classes = useStyles();

  const { email, id } = router.query;

  return (
    <Container>
      <Title>{`Profile Not Found`}</Title>
      <Spacing y={4} />
      <Typography variant="h4" component="h1" className={classes.heading}>
        Profile Not Found
      </Typography>
      <Spacing y={4} />
      {email && (
        <Typography className={classes.textCenter}>
          There is no user with the email{" "}
          <code className={classes.invalid}>{email}</code>.
        </Typography>
      )}
      {id && (
        <Typography className={classes.textCenter}>
          There is no user with the id{" "}
          <code className={classes.invalid}>{id}</code>.
        </Typography>
      )}
    </Container>
  );
};

export default ProfilePage;
