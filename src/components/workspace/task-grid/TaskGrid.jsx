import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";

const TaskGrid = ({ tasks, activeId, onDelete, onCardClick, isDetailOpen }) => {
  return (
    <div
      className={`${styles.TaskGrid} ${
        isDetailOpen ? styles.detailOpen : styles.detailClosed
      }`}
    >
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          activeId={activeId}
          onDelete={onDelete}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
