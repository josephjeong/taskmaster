import NextLink from "next/link";
import { useRouter } from "next/router";
import { makeStyles, TextField, Link, Button } from "@material-ui/core";
import { FormEventHandler } from "react";

import AuthWrapper from "../components/auth/AuthWrapper";
import { signup, SignupInput } from "../api";
import { useAuthContext } from "../context/AuthContext";
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

const SignUpPage: React.FC = () => {
  const classes = useStyles();

  const { setToken } = useAuthContext();
  const router = useRouter();

  useLoggedInRedirect();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    // do signup stuff
    const signupArgs = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as SignupInput;

    const newToken = await signup(signupArgs);

    setToken(newToken);

    // redirect to main app
    router.push("/profile/me");
  };

  return (
    <AuthWrapper title="Sign Up to Tasker">
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="first-name"
          name="first_name"
          type="text"
          required
          label="First Name"
          autoComplete="given-name"
        />
        <TextField
          id="last-name"
          name="last_name"
          type="text"
          required
          label="Last Name"
          autoComplete="family-name"
        />
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
          autoComplete="new-password"
        />
        <TextField
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          label="Confirm Password"
          autoComplete="new-password"
        />
        <div className={classes.footer}>
          <NextLink href="/login" passHref>
            <Link>Already have an account? Login!</Link>
          </NextLink>
          <Button
            size="large"
            type="submit"
            color="primary"
            variant="contained"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </AuthWrapper>
  );
};

export default SignUpPage;
