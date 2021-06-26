import { GetServerSideProps } from 'next'
import { useState } from 'react'
import {
  Container,
  makeStyles,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core'

import { ConnectionStatus, User } from '../../types'
import ConnectionButton from '../../components/profile/ConnectionButton'
import UpdateProfileModal from '../../components/profile/UpdateProfileModal'
import Title from '../../components/shared/Title'

const EXAMPLE_USER: User = {
  id: 'b59aa143-5e1c-46af-b05c-85908324e097',
  email: 'soorria.ss@gmail.com',
  firstName: 'Soorria',
  lastName: 'Saruva',
  avatarUrl: 'https://mooth.tech/logo.svg',
}

interface ProfilePageProps {
  user: User
}

const useStyles = makeStyles(theme => ({
  userDetailsWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(3),
    },
  },
  name: {
    fontWeight: 'bold',
    marginBotton: theme.spacing(1),
  },
  userDetails: {
    flex: '1 0',
  },
  avatar: {
    width: 100,
    height: 100,
  },
}))

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const classes = useStyles()
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.UNCONNECTED
  )
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const userName = `${user.firstName} ${user.lastName}`

  const handleConnectionButtonClick = () => {
    setConnectionStatus(prev => {
      switch (prev) {
        case ConnectionStatus.CONNECTED:
          return ConnectionStatus.UNCONNECTED
        case ConnectionStatus.UNCONNECTED:
          return ConnectionStatus.REQUESTED
        case ConnectionStatus.REQUESTED:
          return ConnectionStatus.CONNECTED
      }
    })
  }

  return (
    <Container>
      <Title>{`${userName}'s Profile`}</Title>
      <div className={classes.userDetailsWrapper}>
        <div>
          <Avatar
            alt={userName}
            src={user.avatarUrl}
            className={classes.avatar}
          />
        </div>
        <div className={classes.userDetails}>
          <Typography variant="h4" component="h1" className={classes.name}>
            {userName}
          </Typography>
          <Typography>{user.email}</Typography>
        </div>
        <div>
          <ConnectionButton
            status={connectionStatus}
            onClick={handleConnectionButtonClick}
          />
        </div>
      </div>

      <div>
        <Button onClick={() => setShowUpdateModal(p => !p)}>
          Toggle Modal
        </Button>
        <UpdateProfileModal
          open={showUpdateModal}
          currentProfile={user}
          onClose={() => setShowUpdateModal(false)}
        />
      </div>
    </Container>
  )
}

export default ProfilePage

export const getServerSideProps: GetServerSideProps<ProfilePageProps> =
  async () => {
    return {
      props: { user: EXAMPLE_USER },
    }
  }
