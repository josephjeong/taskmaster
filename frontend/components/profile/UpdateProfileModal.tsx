import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  makeStyles,
} from '@material-ui/core'
import { FormEventHandler } from 'react'

import { User } from '../../types'

interface UpdateProfileModalProps {
  open: boolean
  currentProfile: User
  onClose: () => void
  onSave?: (updatedUser: Partial<User>) => any
}

const useStyles = makeStyles(theme => ({
  spacing: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}))

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  open,
  onClose,
  currentProfile,
  onSave,
}) => {
  const classes = useStyles()

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    const possiblyUpdatedProfile = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
    ) as Partial<User>

    onSave?.(possiblyUpdatedProfile)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="update-profile-modal-title"
    >
      <DialogTitle id="update-profile-modal-title">Update Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.spacing}>
          <TextField
            id="first-name"
            name="firstName"
            type="text"
            label="First Name"
            autoComplete="given-name"
            defaultValue={currentProfile.firstName}
          />
          <TextField
            id="last-name"
            name="lastName"
            type="text"
            label="Last Name"
            autoComplete="family-name"
            defaultValue={currentProfile.lastName}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            defaultValue={currentProfile.email}
          />
          <TextField
            id="avatar-url"
            name="avatarUrl"
            type="url"
            label="Avatar Url"
            autoComplete="url"
            defaultValue={currentProfile.avatarUrl}
          />
          <TextField
            id="bio"
            name="bio"
            multiline
            label="Bio"
            rows={3}
            autoComplete="on"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateProfileModal
