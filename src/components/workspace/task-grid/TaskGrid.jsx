import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";
const TaskGrid = ({ tasks }) => {
  return (
    <div className={styles.TaskGrid}>
      <TaskCard task={tasks[0]} />
    </div>
  );
};

export default TaskGrid;
