import styles from "./TaskGrid.module.css";
import TaskCard from "../task-card/TaskCard";
import useTaskStore from "../../../store/taskStore";

const TaskGrid = () => {
  const {
    tasks,
    activeId,
    isDetailOpen,
    removeTask,
    setSelectedTaskId,
    setIsDetailOpen,
  } = useTaskStore();

  // 카드 클릭 시 DetailPanel 열기
  const handleCardClick = (id) => {
    if (id === useTaskStore.getState().selectedTaskId) {
      setIsDetailOpen(!isDetailOpen); // 같은 Task 클릭 시 패널 닫기
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
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          activeId={activeId}
          onDelete={() => removeTask(task.id)} // Zustand에서 삭제 함수 호출
          onCardClick={() => handleCardClick(task.id)} // 상태 업데이트
        />
      ))}
    </div>
  );
};

export default TaskGrid;
