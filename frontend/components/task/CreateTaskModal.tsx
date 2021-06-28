import React from 'react';
import { makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@material-ui/core';
import NumericInput from 'material-ui-numeric-input';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import { Task } from '../../types';

const useStyles = makeStyles((theme) => ({
  fullWidthInput: {
    width: '100%',
    margin: '5px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    margin: '5px'
  },
  rowInputLeft: {
    marginRight: '2.5px',
    flex: 1
  },
  rowInputRight: {
    marginLeft: '2.5px',
    flex: 1
  }
}));

type CreateTaskModalProps = {
  open: boolean,
  currentTask: Task,
  onClose: () => void,
  onSubmit?: (task: Task) => any
};

const CreateTaskModal = ({
  open,
  currentTask,
  onClose,
  onSubmit
}: CreateTaskModalProps) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [deadline, setDeadline] = React.useState(moment());
  const [estimatedDays, setEstimatedDays] = React.useState<number | undefined>();

  const classes = useStyles();

  const submit = () => {
    console.log(title, description);
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
    >
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
        <TextField
          className={classes.fullWidthInput}
          required
          label='Title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          className={classes.fullWidthInput}
          required
          multiline
          rows={10}
          label='Description'
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className={classes.row}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              className={classes.rowInputLeft}
              disableToolbar
              variant='inline'
              format='DD/MM/yyyy'
              margin='normal'
              label='Due date'
              value={deadline}
              onChange={(date) => setDeadline(date!)}
            />
            <KeyboardTimePicker
              className={classes.rowInputRight}
              margin='normal'
              label='Due time'
              value={deadline}
              onChange={(date) => setDeadline(date!)}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.row}>
          <FormControl variant='outlined' className={classes.rowInputLeft}>
            <InputLabel id='task-status-label'>Status</InputLabel>
            <Select
              labelId='task-status-label'
            >
              <MenuItem value='To Do'>To Do</MenuItem>
              <MenuItem value='In Progress'>In Progress</MenuItem>
              <MenuItem value='Blocked'>Blocked</MenuItem>
              <MenuItem value='Done'>Done</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.rowInputRight}>
            <NumericInput
              variant='outlined'
              precision='2'
              decimalSeparator='.'
              thousandSeparator=''
              label='Estimated Days'
              value={estimatedDays}
              onChange={(value) => setEstimatedDays(value)}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          size='large'
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          size='large'
          color='primary'
          variant='contained'
          onClick={() => submit()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTaskModal;
