import React from 'react';
import { makeStyles, TextField, Select, MenuItem, Button, FormControl, InputLabel } from '@material-ui/core';
import NumericInput from 'material-ui-numeric-input';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import PageWrapper from '../components/shared/PageWrapper';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
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
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    margin: '5px'
  }
}))

const CreateTaskPage = () => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [deadline, setDeadline] = React.useState(moment());
  const [estimatedDays, setEstimatedDays] = React.useState<number | undefined>();

  const classes = useStyles();

  const submit = () => {
    console.log(title, description);
  };

  return (
    <PageWrapper title="Create Task">
      <div className={classes.root}>
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
        <div className={classes.footer}>
          <Button
            size='large'
            color='primary'
            variant='contained'
            onClick={() => submit()}
          >
            Create
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CreateTaskPage;
