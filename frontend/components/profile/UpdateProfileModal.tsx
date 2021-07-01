import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { FormEventHandler } from "react";
import { UpdateProfileInput } from "../../api";

import { User } from "../../types";

interface UpdateProfileModalProps {
  open: boolean;
  currentProfile: User;
  onClose: () => void;
  onSave?: (updatedUser: UpdateProfileInput) => any;
}

const useStyles = makeStyles((theme) => ({
  spacing: {
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  open,
  onClose,
  currentProfile,
  onSave,
}) => {
  const classes = useStyles();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const possiblyUpdatedProfile = Object.fromEntries(
      new FormData(event.target as HTMLFormElement)
    ) as Partial<User>;

    const changes: UpdateProfileInput = {};
    Object.keys(currentProfile).map((key) => {
      if (!(key in currentProfile) || key === "id") return;

      const typedKey = key as keyof UpdateProfileInput;

      if (currentProfile[typedKey] !== possiblyUpdatedProfile[typedKey]) {
        changes[typedKey] = possiblyUpdatedProfile[typedKey];
      }
    });

    await onSave?.(changes);
    onClose();
  };

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
            name="first_name"
            type="text"
            label="First Name"
            autoComplete="given-name"
            defaultValue={currentProfile.first_name}
          />
          <TextField
            id="last-name"
            name="last_name"
            type="text"
            label="Last Name"
            autoComplete="family-name"
            defaultValue={currentProfile.last_name}
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
            name="avatar_url"
            type="url"
            label="Avatar Url"
            autoComplete="url"
            defaultValue={currentProfile.avatar_url}
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
  );
};

export default UpdateProfileModal;
