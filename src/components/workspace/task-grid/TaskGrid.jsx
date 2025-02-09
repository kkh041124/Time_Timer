import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";
import useTaskStore from "../../../store/taskStore";

const TaskGrid = () => {
  const {
    tasks,
    activeId,
    isDetailOpen,
    removeTask,
    selectedTaskId,
    setSelectedTaskId,
    setIsDetailOpen,
    filter,
  } = useTaskStore();

  // 필터링된 작업 목록 반환
  const getFilteredTasks = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 현재 시간을 00:00:00으로 설정하여 비교

    return tasks.filter((task) => {
      if (!task.dueDate) return false; // 마감일이 없으면 필터링하지 않음

      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0); // 마감일의 시간도 00:00:00으로 맞추기
      const dayDiff = Math.floor((taskDate - now) / (1000 * 60 * 60 * 24)); // 날짜 차이 계산

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
          return true; // 전체 보기
      }
    });
  };

  const handleCardClick = (id) => {
    if (id === selectedTaskId) {
      setIsDetailOpen(!isDetailOpen);
    } else {
      setSelectedTaskId(id);
      setIsDetailOpen(true);
    }
  };

  return (
    <div
      className={`${styles.TaskGrid} ${
        isDetailOpen ? styles.detailOpen : styles.detailClosed
      }`}
    >
      {getFilteredTasks().map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          activeId={activeId}
          onDelete={() => removeTask(task.id)}
          onCardClick={() => handleCardClick(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskGrid;
