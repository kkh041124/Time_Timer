import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";

const TaskGrid = ({ tasks, activeId }) => {
  return (
    <div className={styles.TaskGrid}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} activeId={activeId} />
      ))}
    </div>
  );
};

export default TaskGrid;
