import NextLink from "next/link";
import { useRouter } from "next/router";
import { makeStyles, TextField, Link, Button } from "@material-ui/core";
import { FormEventHandler } from "react";

import AuthWrapper from "../components/auth/AuthWrapper";
import { useAuthContext } from "../context/AuthContext";
import { login } from "../api";
import { useLoggedInRedirect } from "../hooks/useLoggedInRedirect";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const LoginPage: React.FC = () => {
  const classes = useStyles();
  const { setToken } = useAuthContext();

  useLoggedInRedirect();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // do login stuff
    const newToken = await login(
      formData.get("email") as string,
      formData.get("password") as string
    );

    setToken(newToken);
  };

  return (
    <AuthWrapper title="Login">
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="email"
          name="email"
          type="email"
          required
          label="Email"
          autoComplete="email"
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          label="Password"
          autoComplete="current-password"
        />
        <div className={classes.footer}>
          <NextLink href="/signup" passHref>
            <Link>Don&apos;t have an account? Sign Up!</Link>
          </NextLink>
          <Button
            size="large"
            type="submit"
            color="primary"
            variant="contained"
          >
            Login
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default LoginPage;
