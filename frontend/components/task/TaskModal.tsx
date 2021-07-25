import React, { useRef } from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
} from "@material-ui/core";
import NumericInput from "material-ui-numeric-input";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Alert } from "@material-ui/lab";

import { Task, TaskStatus } from "../../types";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  content: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  fullWidthInput: {
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rowInputLeft: {
    marginRight: "2.5px",
    flex: 1,
  },
  rowInputRight: {
    marginLeft: "2.5px",
    flex: 1,
  },
}));

type TaskModalProps = {
  mode?: "view" | "create" | "edit";
  error?: string | null;
  open: boolean;
  taskInit: Task;
  onClose?: () => void;
  onDelete?: () => void;
  onSubmit?: (task: Partial<Task>) => void;
};

const TaskModal = ({
  mode = "view",
  open,
  taskInit,
  error,
  onClose = () => {},
  onDelete = () => {},
  onSubmit = () => {},
}: TaskModalProps) => {
  const [taskUpdates, setTaskUpdates] = React.useState<Partial<Task>>({});
  const task = React.useMemo(
    () => Object.assign({} as Task, taskInit, taskUpdates),
    [taskInit, taskUpdates]
  );

  useEffect(() => {
    if (mode == "create" && open) {
      setTaskUpdates({});
    }
  }, [open, mode]);

  const classes = useStyles();

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "View Task";
      case "create":
        return "Create Task";
      case "edit":
        return "Edit Task";
    }
  };

  const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (mode === "edit") onSubmit(taskUpdates);
    else onSubmit(task);
  };

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>{getTitle()}</DialogTitle>
      <form onSubmit={(event) => submit(event)}>
        <DialogContent className={classes.content}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            className={classes.fullWidthInput}
            required
            disabled={mode === "view"}
            label="Title"
            value={task.title}
            onChange={(event) => {
              const taskUpdates_ = { ...taskUpdates };
              taskUpdates_.title = event.target.value;
              setTaskUpdates(taskUpdates_);
            }}
          />
          <TextField
            className={classes.fullWidthInput}
            required
            disabled={mode === "view"}
            multiline
            rows={10}
            label="Description"
            value={task.description}
            onChange={(event) => {
              const taskUpdates_ = { ...taskUpdates };
              taskUpdates_.description = event.target.value;
              setTaskUpdates(taskUpdates_);
            }}
          />
          <div className={classes.row}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                className={classes.rowInputLeft}
                disabled={mode === "view"}
                disableToolbar
                variant="inline"
                format="DD/MM/yyyy"
                margin="normal"
                label="Due date"
                value={task.deadline}
                onChange={(date) => {
                  const taskUpdates_ = { ...taskUpdates };
                  taskUpdates_.deadline = date!;
                  setTaskUpdates(taskUpdates_);
                }}
              />
              <KeyboardTimePicker
                className={classes.rowInputRight}
                disabled={mode === "view"}
                margin="normal"
                label="Due time"
                value={task.deadline}
                onChange={(date) => {
                  const taskUpdates_ = { ...taskUpdates };
                  taskUpdates_.deadline = date!;
                  setTaskUpdates(taskUpdates_);
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
          <div className={classes.row}>
            <FormControl variant="outlined" className={classes.rowInputLeft}>
              <Select
                disabled={mode === "view"}
                value={task.status}
                onChange={(event) => {
                  const taskUpdates_ = { ...taskUpdates };
                  taskUpdates_.status = event.target.value as any as TaskStatus;
                  setTaskUpdates(taskUpdates_);
                }}
              >
                <MenuItem value={TaskStatus.NOT_STARTED}>To Do</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TaskStatus.BLOCKED}>Blocked</MenuItem>
                <MenuItem value={TaskStatus.COMPLETED}>Done</MenuItem>
              </Select>
            </FormControl>
            <div className={classes.rowInputRight}>
              <NumericInput
                disabled={mode === "view"}
                variant="outlined"
                precision="2"
                decimalSeparator="."
                thousandSeparator=""
                label="Estimated Days"
                value={task.estimated_days}
                onChange={(value) => {
                  const taskUpdates_ = { ...taskUpdates };
                  taskUpdates_.estimated_days = value;
                  setTaskUpdates(taskUpdates_);
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button size="large" onClick={() => onClose()}>
            Cancel
          </Button>
          {mode === "edit" ? (
            <Button size="large" onClick={() => onDelete()}>
              Delete
            </Button>
          ) : null}
          <Button
            size="large"
            color="primary"
            variant="contained"
            type="submit"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
