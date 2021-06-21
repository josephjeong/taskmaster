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

const LoginPage: React.FC = () => {
  const classes = useStyles()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    // do login stuff
  }

  return (
    <AuthWrapper title="Login">
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.field}
          id="email"
          name="email"
          type="email"
          required
          label="Email"
        />
        <TextField
          className={classes.field}
          id="password"
          name="password"
          type="password"
          required
          label="Password"
        />
        <div className={classes.footer}>
          <NextLink href="/signup" passHref>
            <Link>Don&apos;t have an account? Go to Sign Up</Link>
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
  )
}

export default LoginPage
