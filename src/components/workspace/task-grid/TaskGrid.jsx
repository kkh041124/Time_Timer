import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";
import useTaskStore from "../../../store/taskStore";

const TaskGrid = ({ onDelete, onCardClick }) => {
  const {
    tasks,
    activeId,
    isDetailOpen,
    filter,
    selectedTaskId,
    setSelectedTaskId,
    setIsDetailOpen,
  } = useTaskStore();

  // 필터링 및 정렬된 작업 목록 반환
  const getFilteredTasks = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return tasks
      .filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        const dayDiff = Math.floor((taskDate - now) / (1000 * 60 * 60 * 24));
        switch (filter) {
          case "today":
            return dayDiff === 0;
          case "tomorrow":
            return dayDiff === 1;
          case "week":
            return dayDiff >= 0 && dayDiff <= 6;
          case "finished":
            return task.status === "done";
          case "all":
          default:
            return true;
        }
      })
      .sort((a, b) => a.order - b.order);
  };

  const handleCardClick = (id) => {
    if (id === selectedTaskId) {
      setIsDetailOpen(!isDetailOpen);
    } else {
      setSelectedTaskId(id);
      setIsDetailOpen(true);
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div
      className={`${styles.TaskGrid} ${
        isDetailOpen ? styles.detailOpen : styles.detailClosed
      }`}
    >
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          activeId={activeId}
          onDelete={() => onDelete(task.id)}
          onCardClick={() => handleCardClick(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
