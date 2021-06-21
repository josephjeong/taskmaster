import { makeStyles, Paper, Typography } from '@material-ui/core'

interface AuthWrapperProps {
  title: string
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    bgcolor: '#eee',
  },
  container: {
    padding: theme.spacing(6),
    width: '100%',
    maxWidth: theme.breakpoints.values.sm + 'px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
}))

const AuthWrapper: React.FC<AuthWrapperProps> = ({ title, children }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <Typography className={classes.heading} variant="h2" component="h1">
          {title}
        </Typography>
        {children}
      </Paper>
    </div>
  )
}

export default AuthWrapper
