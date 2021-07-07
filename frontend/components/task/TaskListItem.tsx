import { makeStyles, Paper, Typography } from "@material-ui/core";
import { useState } from "react";
import { Task } from "../../types";
import { formatDate } from "../../utils";
import TaskModal from "./TaskModal";
import TaskStatusPill from "./TaskStatusPill";

interface TaskListItemProps {
  task: Task;
  isEditable?: boolean;
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    padding: theme.spacing(3),
    "& > * + *": {
      marginLeft: theme.spacing(1),
    },
    boxShadow: theme.shadows[3],
    "&:hover": {
      boxShadow: theme.shadows[6],
    },
    border: "none",
    textAlign: "left",
    cursor: "pointer",
  },
  timeDetails: {
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      marginLeft: theme.spacing(0.5),
    },
  },
  filler: {
    flex: "1 0",
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
}));

const TaskListItem: React.FC<TaskListItemProps> = ({ task, isEditable }) => {
  const [showModal, setShowModal] = useState(false);
  const classes = useStyles();
  return (
    <>
      <Paper
        component="button"
        className={classes.wrapper}
        onClick={() => setShowModal(true)}
      >
        <div>
          <Typography variant="h5" component="p" className={classes.title}>
            {task.title}
          </Typography>
          <div className={classes.timeDetails}>
            {task.deadline && (
              <Typography component="span">
                Deadline: {formatDate(task.deadline)}
              </Typography>
            )}
            {task.deadline && task.estimated_days && <span>•</span>}
            {task.estimated_days && (
              <Typography component="span">
                Estimated Days: {task.estimated_days}
              </Typography>
            )}
          </div>
        </div>
        <div className={classes.filler} />
        <TaskStatusPill status={task.status} />
      </Paper>
      <TaskModal
        mode={isEditable ? "edit" : "view"}
        open={showModal}
        onClose={() => setShowModal(false)}
        taskInit={task}
        onSubmit={() => {
          if (!isEditable) return;
          // TODO: handle edit
        }}
      />
    </>
  );
};

export default TaskListItem;
