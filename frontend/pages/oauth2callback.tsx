import {
  CircularProgress,
  Container,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import Spacing from "../components/shared/Spacing";
import Title from "../components/shared/Title";
import { useAuthContext } from "../context/AuthContext";

type OAuthCallbackProps =
  | { code: string; error: null }
  | { code: null; error: string };

const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "bold",
    marginBotton: theme.spacing(1),
    textAlign: "center",
  },
  textCenter: {
    textAlign: "center",
  },
}));

const OAuthCallbackPage: React.FC<OAuthCallbackProps> = ({ code, error }) => {
  const classes = useStyles();
  const { push } = useRouter();
  const { user, token } = useAuthContext();

  useEffect(() => {
    if (error) return;

    if (user) {
      console.log({ code });
      // Send code to backend

      // router.push(`/profile/${user.id}`);
    } else if (!user && !token) {
      router.push("/login");
    }
  }, [push, user, token, code, error]);

  return (
    <Container>
      <Title>Saving Calendar Integration</Title>
      <Spacing y={4} />
      <Typography variant="h4" component="h1" className={classes.heading}>
        {error
          ? "An error occurred while connecting to your calendar"
          : "Saving your Calendar Integration"}
      </Typography>
      <Spacing y={4} />
      {error ? (
        <Typography className={classes.textCenter}>
          This error occured when connecting to your calendar: {error}
        </Typography>
      ) : (
        <div className={classes.textCenter}>
          <CircularProgress />
        </div>
      )}
    </Container>
  );
};

export default OAuthCallbackPage;

export const getServerSideProps: GetServerSideProps<OAuthCallbackProps> =
  async ({ query }) => {
    const code = typeof query.code === "string" ? query.code : null;

    if (!code) {
      return {
        props: { code: null, error: "Invalid Code" },
      };
    }

    const error = typeof query.error === "string" ? query.error : null;

    if (error) {
      return {
        props: { code: null, error },
      };
    }

    return {
      props: { code, error: null },
    };
  };
