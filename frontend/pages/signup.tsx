import NextLink from 'next/link'
import { makeStyles, TextField, Link, Button } from '@material-ui/core'
import { FormEventHandler } from 'react'

import AuthWrapper from '../components/auth/AuthWrapper'

const useStyles = makeStyles(theme => ({
  form: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  field: {
    width: '100%',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

const SignUpPage: React.FC = () => {
  const classes = useStyles()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    // do signup stuff

    // redirect to main app
  }

  return (
    <AuthWrapper title="Sign Up to Tasker">
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.field}
          id="first-name"
          name="first-name"
          type="text"
          required
          label="First Name"
          autoComplete="given-name"
        />
        <TextField
          className={classes.field}
          id="last-name"
          name="last-name"
          type="text"
          required
          label="Last Name"
          autoComplete="family-name"
        />
        <TextField
          className={classes.field}
          id="email"
          name="email"
          type="email"
          required
          label="Email"
          autoComplete="email"
        />
        <TextField
          className={classes.field}
          id="password"
          name="password"
          type="password"
          required
          label="Password"
          autoComplete="new-password"
        />
        <TextField
          className={classes.field}
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
  )
}

export default SignUpPage
