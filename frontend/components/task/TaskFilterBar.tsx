import React from "react";
import { makeStyles, Container, TextField, FormControl, Select, MenuItem, Button } from "@material-ui/core";
import NumericInput from "material-ui-numeric-input";
import moment from "moment";
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import { TaskStatus } from "../../types";
import Spacing from "../shared/Spacing";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: 140,
    marginTop: 7
  },
  inputDate: {
    width: 180
  }
}));

export type TaskFilters = {
  title?: string,
  user_assignee?: string,
  status?: TaskStatus,
  deadline?: moment.Moment,
  estimated_days?: number
};

type TaskFilterBarProps = {
  filters: TaskFilters,
  onChange: (filters: TaskFilters) => void
};

const TaskFilterBar = ({
  filters,
  onChange
}: TaskFilterBarProps) => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <TextField
        className={classes.input}
        label="Title"
        value={filters.title}
        onChange={(event) => {
          const filters_ = { ...filters };
          filters_.title = event.target.value;
          onChange(filters_);
        }}
      />
      <Spacing x={1} />
      <FormControl className={classes.input} variant="outlined">
        <Select
          value={filters.status}
          onChange={(event) => {
            const filters_ = { ...filters };
            filters_.status = event.target.value as any as TaskStatus;
            if (filters_.status == undefined) {
              delete filters_.status;
            }
            onChange(filters_);
          }}
        >
          <MenuItem value={undefined}>Status</MenuItem>
          <MenuItem value={TaskStatus.NOT_STARTED}>To Do</MenuItem>
          <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
          <MenuItem value={TaskStatus.BLOCKED}>Blocked</MenuItem>
          <MenuItem value={TaskStatus.COMPLETED}>Done</MenuItem>
        </Select>
      </FormControl>
      <Spacing x={1} />
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          className={classes.inputDate}
          disableToolbar
          variant="inline"
          format="DD/MM/yyyy"
          margin="normal"
          label="Due before date"
          value={filters.deadline}
          onChange={(date) => {
            const filters_ = { ...filters };
            filters_.deadline = date!;
            onChange(filters_);
          }}
        />
        <Spacing x={1} />
        <KeyboardTimePicker
          className={classes.inputDate}
          margin="normal"
          label="Due before time"
          value={filters.deadline}
          onChange={(date) => {
            const filters_ = { ...filters };
            filters_.deadline = date!;
            onChange(filters_);
          }}
        />
      </MuiPickersUtilsProvider>
      <Spacing x={1} />
      <div className={classes.input}>
        <NumericInput
          variant="outlined"
          precision="2"
          decimalSeparator="."
          thousandSeparator=""
          label="Estimated Days"
          value={filters.estimated_days}
          onChange={(value) => {
            const filters_ = { ...filters };
            filters_.estimated_days = value;
            onChange(filters_);
          }}
        />
      </div>
      <Spacing x={1} />
      <Button
        size="large"
        disabled={filters === {}}
        onClick={() => onChange({})}
      >Clear Filters</Button>
    </Container>
  );
};

export default TaskFilterBar;
