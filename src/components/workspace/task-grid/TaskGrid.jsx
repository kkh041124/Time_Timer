import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";
const TaskGrid = ({ tasks }) => {
  return (
    <div className={styles.TaskGrid}>
      {tasks.map((task, index) => (
        <TaskCard key={index} task={task} className={styles.taskCard} />
      ))}
    </div>
  );
};

export default TaskGrid;
